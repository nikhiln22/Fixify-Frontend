import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../../components/auth/Register";
import {
  RegisterFormData,
  // TechnicianTempRegisterResponse,
} from "../../../types/auth.types";
import authService from "../../../services/auth.services";
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
          email: response?.data?.email,
          action: "register",
          role: "TECHNICIAN",
          tempTechnicianId: response?.data?.tempTechnicianId,
        };

        console.log(
          "stateData in the technician register component:",
          stateData
        );

        navigate(`/technician/otp`, { state: stateData });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Registration failed",
        type: "error",
      });
      throw error;
    }
  };

  return <Register role="TECHNICIAN" onSubmit={handleSubmit} />;
};
