import React from "react";
import { useNavigate } from "react-router-dom";
import { Otp } from "../../../components/auth/Otp";
import authService from "../../../services/authServices";
import { showToast } from "../../../utils/toast";
import { OtpPurpose, OTPVerification } from "../../../types/auth.types";

export const UserOtp: React.FC = () => {
  const navigate = useNavigate();

  const handleVerifyOtp = async (
    values: { otp: string },
    email: string,
    purpose: OtpPurpose
  ) => {
    try {
      const data: OTPVerification = {
        email,
        otp: values.otp,
        purpose,
      };

      const response = await authService.verifyOtp(data, "USER", purpose);

      if (response.success) {
        localStorage.removeItem("otpStartTime");

        if (purpose === "PASSWORD_RESET") {
          showToast({
            message: response.message || "OTP verified successfully",
            type: "success",
          });
          navigate(`/user/resetpassword`, {
            state: { email },
          });
        } else {
          showToast({
            message:
              response.message ||
              "Email verified successfully! Please login to continue.",
            type: "success",
          });
          navigate(`/user/login`);
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
      const result = await authService.resendOtp(email, "USER");

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
    <Otp
      role="USER"
      onVerifyOtp={handleVerifyOtp}
      onResendOtp={handleResendOtp}
    />
  );
};
