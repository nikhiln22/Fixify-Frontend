import React from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../../../components/auth/Register";
import {
  RegisterFormData,
  TechnicianTempRegisterResponse,
} from "../../../types/auth.types";
import authService from "../../../services/auth.services";
import { showToast } from "../../../utils/toast";

export const TechnicianRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      const response = (await authService.register(
        values,
        "TECHNICIAN"
      )) as TechnicianTempRegisterResponse;

      if (response.success) {
        showToast({
          message: `OTP has been sent to ${values.email}`,
          type: "success",
        });

        const stateData = {
          email: response.email,
          action: "register",
          role: "TECHNICIAN",
          tempTechnicianId: response.tempTechnicianId,
        };

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

  return (
    <div>
      <Register role="TECHNICIAN" onSubmit={handleSubmit} />
    </div>
  );
};