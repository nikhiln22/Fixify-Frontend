import React from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../../../components/auth/ForgotPassword";
import authService from "../../../services/authServices";
import { showToast } from "../../../utils/toast";

export const UserForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email, "USER");
      showToast({
        message: response.message || `OTP sent to ${email}.`,
        type: "success",
      });

      navigate(`/user/otp`, {
        state: { email: email, action: "forgot" },
      });

      return response;
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message || "Failed to send OTP.",
        type: "error",
      });
      throw err;
    }
  };

  return <ForgotPassword role="USER" onSubmit={handleForgotPassword} />;
};
