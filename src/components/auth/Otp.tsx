import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import OTPInput from "../common/OtpInput";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { OtpProps, OtpPurpose } from "../../types/auth.types";
import { otpValidationSchema } from "../../utils/validations/authvalidationschema";
import { motion } from "framer-motion";

export const Otp: React.FC<OtpProps> = ({ role, onVerifyOtp, onResendOtp }) => {
  const location = useLocation();

  const email = location.state?.email || "";
  const tempUserId = location.state?.tempUserId || "";
  const tempTechnicianId = location.state?.tempTechnicianId || "";
  const actionFromState = location.state?.action || "register";

  console.log("email in the otp component:", email);
  console.log("tempUserId in the otp component:", tempUserId);
  console.log("tempTechnicianId in the otp component:", tempTechnicianId);
  console.log("actionFromState in the otp component:", actionFromState);

  const otpPurpose: OtpPurpose =
    actionFromState === "forgot" ? "PASSWORD_RESET" : "REGISTRATION";

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

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setLoading(true);

        await onVerifyOtp(values, email, otpPurpose);
      } catch (err) {
        const error = err as { message?: string };
        setErrors({ otp: error.message || "Verification failed" });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleResend = async () => {
    try {
      setLoading(true);

      await onResendOtp(email);

      formik.setFieldValue("otp", "");

      const newStartTime = Date.now();
      localStorage.setItem("otpStartTime", newStartTime.toString());
      setTimer(60);
      setIsOtpExpired(false);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role}>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            OTP Verification
          </h4>
          <p className="text-lg text-gray-600 font-medium">
            Enter the verification code
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={formik.handleSubmit}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <OTPInput
                length={4}
                value={formik.values.otp}
                onchange={(otp) => formik.setFieldValue("otp", otp)}
              />
            </div>
            {formik.errors.otp && formik.touched.otp && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center space-x-1 text-red-500 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formik.errors.otp}</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={
                loading ||
                isOtpExpired ||
                formik.isSubmitting ||
                !formik.values.otp ||
                formik.values.otp.length < 4
              }
              isLoading={loading || formik.isSubmitting}
              className="w-full py-4 text-base font-semibold"
            >
              {loading || formik.isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center pt-4"
          >
            {isOtpExpired ? (
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Your OTP has expired
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Resend OTP"}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-teal-600 bg-teal-50 px-4 py-3 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Code expires in <span className="font-bold">{timer}s</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Didn't receive the code? You can resend after the timer
                  expires.
                </p>
              </div>
            )}
          </motion.div>
        </motion.form>
      </div>
    </AuthLayout>
  );
};
