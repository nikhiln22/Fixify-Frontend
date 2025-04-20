import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { verifyOtp, resendOtp } from "../../services/auth.services";
import OTPInput from "../common/OtpInput";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { showToast } from "../../utils/toast";
import { OtpProps } from "../../types/auth.types";
import { otpValidationSchema } from "../../utils/validations/authvalidationschema"; 

export const Otp: React.FC<OtpProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const tempUserId = location.state?.tempUserId || "";
  const tempTechnicianId = location.state?.tempTechnicianId || "";
  const purpose = location.state?.action || "register";
  
  const otpPurpose = purpose === "forgot" ? "PASSWORD_RESET" : "REGISTRATION";

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
        
        let payload;
        
        if (otpPurpose === "PASSWORD_RESET") {
          payload = { email, otp: values.otp };
        } else {
          if (role.toLowerCase() === "technician") {
            payload = { tempTechnicianId, otp: values.otp, email };
          } else {
            payload = { tempUserId, otp: values.otp, email };
          }
        }
        
        console.log(`Sending ${otpPurpose} OTP verification for ${role}:`, payload);
        
        const response = await verifyOtp(payload, role, otpPurpose);

        if (response.success) {
          localStorage.removeItem("otpStartTime");
          
          if (otpPurpose === "PASSWORD_RESET") {
            showToast({ 
              message: response.message || "OTP verified successfully", 
              type: "success" 
            });
            navigate(`/${role.toLowerCase()}/resetpassword`, {
              state: { email }
            });
          } else {
            showToast({ 
              message: response.message || "Registration successful!", 
              type: "success" 
            });
            navigate(`/${role.toLowerCase()}/login`);
          }
        } else {
          showToast({ 
            message: response.message || "Invalid OTP", 
            type: "error" 
          });
          setErrors({ otp: "Invalid OTP" });
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        const errorMessage = error?.response?.data?.message || "Something went wrong!";
        
        showToast({
          message: errorMessage,
          type: "error",
        });
        setErrors({ otp: errorMessage });
        console.error("OTP verification error:", err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleResend = async () => {
    try {
      setLoading(true); 
      const result = await resendOtp(email, role);
      
      if (result.success) {
        // Reset OTP input
        formik.setFieldValue('otp', '');

        const newStartTime = Date.now();
        localStorage.setItem("otpStartTime", newStartTime.toString());

        setTimer(60);
        setIsOtpExpired(false);

        showToast({
          message: result.message || "OTP Resent Successfully",
          type: "success",
        });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast({
        message: error?.response?.data?.message || "Failed to resend OTP",
        type: "error",
      });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <AuthLayout role={role}>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full space-y-6 p-8"
      >
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
            onchange={(otp) => formik.setFieldValue('otp', otp)} 
          />
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-red-500 text-xs text-center mt-1">{formik.errors.otp}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || isOtpExpired || formik.isSubmitting}
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
      </form>
    </AuthLayout>
  );
};