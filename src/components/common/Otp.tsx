import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OTPVerification, OTPResponse } from '../../types/auth.types';
import { useLocation } from 'react-router-dom'

const Otp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tempUserId = location.state?.userId || '';
    const email = location.state?.email || '';

    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(true); 
    
 
    const [timer, setTimer] = useState<number>(() => {
        const savedTimerValue = localStorage.getItem('otpTimer');
        const savedTimerExpiry = localStorage.getItem('otpTimerExpiry');
        
        if (savedTimerValue && savedTimerExpiry) {
            const expiryTime = parseInt(savedTimerExpiry);
            const currentTime = new Date().getTime();
            
            const remainingTime = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
            
            if (remainingTime <= 0) {
                setIsOtpExpired(true);
            }
            
            return remainingTime > 0 ? remainingTime : 0;
        }
        return 60;
    });
    
    const [canResend, setCanResend] = useState<boolean>(timer === 0);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    const isOtpComplete = otp.every(digit => digit !== '');

    useEffect(() => {
        if (timer > 0) {
            const expiryTime = new Date().getTime() + timer * 1000;
            localStorage.setItem('otpTimer', timer.toString());
            localStorage.setItem('otpTimerExpiry', expiryTime.toString());
            setIsOtpExpired(false);
            
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newValue = prevTimer - 1;
                    if (newValue === 0) {
                        localStorage.removeItem('otpTimer');
                        localStorage.removeItem('otpTimerExpiry');
                        setIsOtpExpired(true);
                    } else {
                        localStorage.setItem('otpTimer', newValue.toString());
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
            setIsOtpExpired(true);
        }
    }, [timer]);

    useEffect(() => {
        if (otpSent) {
            setOtp(['', '', '', '']);
            setOtpSent(false);
        }
    }, [otpSent]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value.match(/[^0-9]/)) return; 

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (isOtpExpired) {
            setError('OTP has expired. Please request a new OTP.');
            return;
        }

        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        const otpVerificationData: OTPVerification = {
            tempUserId,
            otp: otpString,
            email
        };

        console.log("otpVerificationData:", otpVerificationData);

        try {
            setLoading(true);
            const response = await axios.post<OTPResponse>('http://localhost:3000/verifyotp', otpVerificationData);

            console.log("response from the otp page:", response);

            if (response.data.success) {
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpTimerExpiry');
                navigate('/');
            } else {
                setError('OTP verification failed. Please try again.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (canResend) {
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:3000/resendotp', { email: email });

                if (response.data.success) {
                    setTimer(60);
                    setCanResend(false);
                    setIsOtpExpired(false);
                    setOtpSent(true);
                    
                    const expiryTime = new Date().getTime() + 60 * 1000;
                    localStorage.setItem('otpTimer', '60');
                    localStorage.setItem('otpTimerExpiry', expiryTime.toString());
                } else {
                    setError('Failed to resend OTP');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to resend OTP');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-400">
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
                <div className="absolute top-6 left-6">
                    <h1 className="text-3xl font-bold text-black">FIXIFY</h1>
                </div>

                <div className="text-center">
                    <div className="w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-black text-lg">Fixify</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your OTP</h2>
                    <p className="text-gray-600 mt-2">Please enter the OTP sent to your email</p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="md:hidden text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-600">FIXIFY</h1>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Enter OTP</h2>
                        <p className="mt-2 text-sm text-gray-800">Enter the 4-digit OTP sent to your email</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isOtpExpired && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">Your OTP has expired. Please request a new one.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 p-8 rounded-lg">
                        <div className="flex justify-between space-x-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className={`w-14 h-14 text-center text-2xl border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${isOtpExpired ? 'opacity-50' : ''}`}
                                    disabled={isOtpExpired}
                                />
                            ))}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || isOtpExpired || !isOtpComplete}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isOtpExpired || !isOtpComplete ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            {isOtpExpired ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                                >
                                    {loading ? 'Sending...' : 'Resend OTP'}
                                </button>
                            ) : (
                                <span className="text-sm text-gray-600">
                                    Resend OTP in {timer} seconds
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Otp;