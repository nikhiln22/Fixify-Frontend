import React from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../../../components/auth/ForgotPassword";
import authService from "../../../services/authServices";
import { showToast } from "../../../utils/toast";

export const TechnicianForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email, "TECHNICIAN");
      showToast({
        message: response.message || `OTP sent to ${email}.`,
        type: "success",
      });

      navigate(`/technician/otp`, {
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

  return <ForgotPassword role="TECHNICIAN" onSubmit={handleForgotPassword} />;
};
