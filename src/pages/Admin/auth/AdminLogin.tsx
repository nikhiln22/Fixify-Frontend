import React from "react";
import { Login } from "../../../components/auth/Login";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/auth.services";
import { showToast } from "../../../utils/toast";
import Cookies from "js-cookie";
import { LoginFormData } from "../../../types/auth.types";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = async (values: LoginFormData) => {
    try {
      const response = await authService.login(values, "ADMIN");
      console.log("response from the admin login page:", response);

      if (response.success) {
        const serverRole = response.data.role || "ADMIN";

        showToast({
          message: "Login successful!",
          type: "success",
        });

        Cookies.set(
          `${serverRole.toLowerCase()}_access_token`,
          response.data.access_token
        );

        navigate("/admin/dashboard");
      } else {
        showToast({
          message: response.message || "Login failed",
          type: "error",
        });
      }
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message || "Login failed.",
        type: "error",
      });
    }
  };
  return (
    <div>
      <Login role="ADMIN" onsubmit={handleLoginSubmit} />
    </div>
  );
};
