import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../../components/auth/Register";
import { RegisterFormData } from "../../../types/auth.types";
import { authService } from "../../../services/authServices";
import { showToast } from "../../../utils/toast";

export const TechnicianRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      console.log(
        "values in the technican register page sending to the backend:",
        values
      );
      const response = await authService.register(values, "TECHNICIAN");

      console.log("response in the technician register page:", response);

      if (response.success) {
        showToast({
          message: `OTP has been sent to ${values.email}`,
          type: "success",
        });

        const stateData = {
          email: response.data.email,
          action: "register",
          role: "TECHNICIAN",
        };

        console.log(
          "stateData in the technician register component:",
          stateData
        );

        navigate(`/technician/otp`, { state: stateData });
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

  return <Register role="TECHNICIAN" onSubmit={handleSubmit} />;
};
