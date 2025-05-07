import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import OTPInput from "../common/OtpInput";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { OtpProps, OtpPurpose } from "../../types/auth.types";
import { otpValidationSchema } from "../../utils/validations/authvalidationschema";

export const Otp: React.FC<OtpProps> = ({ role, onVerifyOtp, onResendOtp }) => {
  const location = useLocation();

  const email = location.state?.email || "";
  const tempUserId = location.state?.tempUserId || "";
  const tempTechnicianId = location.state?.tempTechnicianId || "";
  const actionFromState = location.state?.action || "register";

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
        localStorage.getItem("otpStartTime") || now.toString(),
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

        const tempId =
          role.toLowerCase() === "technician" ? tempTechnicianId : tempUserId;

        await onVerifyOtp(values, email, otpPurpose, tempId);
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
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6 p-8">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-black capitalize">
            OTP Verification
          </h4>
          <p className="mt-2 text-base text-gray-700">
            Enter the OTP sent to your email
          </p>
        </div>

        <div className="space-y-2">
          <OTPInput
            length={4}
            value={formik.values.otp}
            onchange={(otp) => formik.setFieldValue("otp", otp)}
          />
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-red-500 text-xs text-center mt-1">
              {formik.errors.otp}
            </p>
          )}
        </div>

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
          className="w-full mt-4"
        >
          Verify OTP
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
      </form>
    </AuthLayout>
  );
};
