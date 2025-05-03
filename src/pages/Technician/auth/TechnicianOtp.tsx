import React from "react";
import { useNavigate } from "react-router-dom";
import { Otp } from "../../../components/auth/Otp";
import authService from "../../../services/auth.services";
import { showToast } from "../../../utils/toast";
import { OtpPurpose, OTPVerification } from "../../../types/auth.types";

export const TechnicianOtp: React.FC = () => {
  const navigate = useNavigate();

  const handleVerifyOtp = async (
    values: { otp: string },
    email: string,
    purpose: OtpPurpose,
    tempId?: string
  ) => {
    try {
      let data: OTPVerification;

      if (purpose === "PASSWORD_RESET") {
        data = {
          email,
          otp: values.otp,
          purpose,
        };
      } else {
        data = {
          tempTechnicianId: tempId,
          otp: values.otp,
          email,
          purpose,
        };
      }

      const response = await authService.verifyOtp(data, "TECHNICIAN", purpose);

      if (response.success) {
        localStorage.removeItem("otpStartTime");

        if (purpose === "PASSWORD_RESET") {
          showToast({
            message: response.message || "OTP verified successfully",
            type: "success",
          });
          navigate(`/technician/resetpassword`, {
            state: { email },
          });
        } else {
          showToast({
            message: response.message || "Registration successful!",
            type: "success",
          });
          navigate(`/technician/login`);
        }
      } else {
        showToast({
          message: response.message || "Invalid OTP",
          type: "error",
        });
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";

      showToast({
        message: errorMessage,
        type: "error",
      });
      throw new Error(errorMessage);
    }
  };

  const handleResendOtp = async (email: string) => {
    try {
      const result = await authService.resendOtp(email, "TECHNICIAN");

      if (result.success) {
        showToast({
          message: result.message || "OTP Resent Successfully",
          type: "success",
        });
      } else {
        throw new Error(result.message || "Failed to resend OTP");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Failed to resend OTP";

      showToast({
        message: errorMessage,
        type: "error",
      });
      throw new Error(errorMessage);
    }
  };

  return (
    <div>
      <Otp
        role="TECHNICIAN"
        onVerifyOtp={handleVerifyOtp}
        onResendOtp={handleResendOtp}
      />
    </div>
  );
};
