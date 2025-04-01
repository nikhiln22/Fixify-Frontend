import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginFormData, LoginResponse } from '../../types/auth.types';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData, 'value')
        setError('');

        try {
            setLoading(true);

            const response = await axios.post<LoginResponse>('http://localhost:3000/login', {
                email: formData.email,
                password: formData.password,
                role: 'user',
            });

            if (response.data.success) {
                navigate('/home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
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
                    <h2 className="text-2xl font-bold text-gray-800">Welcome to Fixify</h2>
                    <p className="text-gray-600 mt-2">Join thousands of satisfied users today</p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="md:hidden text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-600">FIXIFY</h1>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">User Login</h2>
                        <p className="mt-2 text-sm text-gray-800">Please Login to Continue</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6  p-8 rounded-lg ">

                        <div className="flex flex-col items-start">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your Email...."
                                required
                            />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your Password...."
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
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
                                    'Login'
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                New here? join us today and get started!{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="font-medium text-black hover:text-white focus:outline-none"
                                >
                                    Sign Up to continue.
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;