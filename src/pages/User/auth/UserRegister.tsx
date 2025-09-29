import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../../components/auth/Register";
import { RegisterFormData } from "../../../types/auth.types";
import { authService } from "../../../services/authServices";
import { showToast } from "../../../utils/toast";

export const UserRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      const response = await authService.register(values, "USER");
      console.log("response in the user register page:", response);

      if (response.success) {
        showToast({
          message: `OTP has been sent to ${values.email}`,
          type: "success",
        });

        const stateData = {
          email: response.data.email,
          action: "register",
        };

        navigate(`/user/otp`, { state: stateData });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      showToast({
        message: errorMessage,
        type: "error",
      });
      throw error;
    }
  };

  return <Register role="USER" onSubmit={handleSubmit} />;
};
