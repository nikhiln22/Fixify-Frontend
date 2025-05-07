import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../../components/auth/Register";
import {
  RegisterFormData,
  UserTempRegisterResponse,
} from "../../../types/auth.types";
import authService from "../../../services/auth.services";
import { showToast } from "../../../utils/toast";

export const UserRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      const response = (await authService.register(
        values,
        "USER",
      )) as UserTempRegisterResponse;

      if (response.success) {
        showToast({
          message: `OTP has been sent to ${values.email}`,
          type: "success",
        });

        const stateData = {
          email: response.email,
          action: "register",
          role: "USER",
          tempUserId: response.tempUserId,
        };

        navigate(`/user/otp`, { state: stateData });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Registration failed",
        type: "error",
      });
      throw error;
    }
  };

  return (
    <div>
      <Register role="USER" onSubmit={handleSubmit} />
    </div>
  );
};
