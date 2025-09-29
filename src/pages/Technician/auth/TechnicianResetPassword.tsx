import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPassword } from "../../../components/auth/ResetPassword";
import { authService } from "../../../services/authServices";
import { showToast } from "../../../utils/toast";

export const TechnicianResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleResetPassword = async (password: string) => {
    try {
      const response = await authService.resetPassword(
        email,
        password,
        "TECHNICIAN"
      );
      showToast({
        message: response.message || "Password reset successfully!",
        type: "success",
      });
      navigate("/technician/login");
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

  return <ResetPassword role="TECHNICIAN" onSubmit={handleResetPassword} />;
};
