import React from "react";
import { Login } from "../../../components/auth/Login";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authServices";
import { showToast } from "../../../utils/toast";
import Cookies from "js-cookie";
import { LoginFormData } from "../../../types/auth.types";
import { setAdminData } from "../../../redux/slices/adminSlice";
import { Iadmin } from "../../../models/admin";
import { useDispatch } from "react-redux";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

        const adminData = response.data.admin as Iadmin;

        const adminInfo = {
          _id: adminData._id,
          email: adminData.email,
          status: adminData.status,
        };

        dispatch(setAdminData(adminInfo));

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
