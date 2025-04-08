import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyOtp, resendOtp } from "../../services/auth.services";
import OTPInput from "../common/OtpInput";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { toast } from "react-toastify";
import { OtpProps } from "../../types/auth.types";
import Cookies from "js-cookie";

export const Otp: React.FC<OtpProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tempUserId = location.state?.tempUserId || "";
  const email = location.state?.email || "";
  const action = location.state?.action || "register";

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(60);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);

  useEffect(() => {

    const storedStartTime = localStorage.getItem("otpStartTime");
    const now = Date.now();

    
    if (!storedStartTime || now - parseInt(storedStartTime) >= 60 * 1000) {
      localStorage.setItem("otpStartTime", now.toString());
    }

    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const startTime = parseInt(
        localStorage.getItem("otpStartTime") || now.toString()
      );
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const remainingSeconds = Math.max(60 - elapsedSeconds, 0);

      setTimer(remainingSeconds);

      if (remainingSeconds === 0) {
        setIsOtpExpired(true);
        clearInterval(interval);
      } else {
        setIsOtpExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp({ tempUserId, otp, email }, role);
      console.log(
        "response from the verifyOtp function in otp Component:",
        response
      );

      if (response.success) {
        localStorage.removeItem("otpStartTime");

        if (action === "forgot") {
          navigate(`/${role}/resetpassword`, { state: { email: email } });
        } else {
          Cookies.set(
            `${role.toLowerCase()}_access_token`,
            response.access_token
          );
          Cookies.set(
            `${role.toLowerCase()}_refresh_token`,
            response.refresh_token
          );

          toast.success(response.message);
          navigate(`/${role.toLowerCase()}/home`);
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const result = await resendOtp(email, role);
      console.log("response from resend at resend otp function:", result);

      if (result.success) {
        setOtp("");

        const newStartTime = Date.now();
        localStorage.setItem("otpStartTime", newStartTime.toString());

        setTimer(60);
        setIsOtpExpired(false);

        toast.success(result.message || "OTP Resent Successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role}>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full md:w-[28rem] mx-auto space-y-6 p-8"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
      >
        <div className="text-center">
          <h4 className="text-3xl font-bold text-black capitalize">
            OTP Verification
          </h4>
          <p className="mt-2 text-base text-gray-700">
            Enter the OTP sent to your email
          </p>
        </div>

        <OTPInput length={4} value={otp} onchange={setOtp} />

        <Button
          type="submit"
          disabled={loading || isOtpExpired}
          className="w-full mt-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        {isOtpExpired ? (
          <p className="text-center text-sm mt-3">
            Didn't receive the code?{" "}
            <span
              onClick={handleResend}
              className="text-blue-600 underline cursor-pointer"
            >
              Resend OTP
            </span>
          </p>
        ) : (
          <p className="text-center text-sm mt-2 text-gray-600">
            Resend OTP in {timer}s
          </p>
        )}
      </motion.form>
    </AuthLayout>
  );
};