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
        showToast({
          message: "Login successful!",
          type: "success",
        });

        const expiresIn15Minutes = new Date(
          new Date().getTime() + 15 * 60 * 1000
        );

        Cookies.set("access_token", response.data.access_token, {
          expires: expiresIn15Minutes,
        });

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
