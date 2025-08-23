import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "../../../components/auth/Login";
import authService from "../../../services/authServices";
import { showToast } from "../../../utils/toast";
import Cookies from "js-cookie";
import { setTechnicianData } from "../../../redux/slices/technicianslice";
import { Itechnician } from "../../../models/technician";
import { LoginFormData } from "../../../types/auth.types";

export const TechnicianLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSubmit = async (values: LoginFormData) => {
    try {
      const response = await authService.login(values, "TECHNICIAN");
      console.log("response from the technician login page:", response);

      if (response.success) {
        showToast({
          message: response.message,
          type: "success",
        });

        const expiresIn15Minutes = new Date(
          new Date().getTime() + 15 * 60 * 1000
        );

        Cookies.set("access_token", response.data.access_token, {
          expires: expiresIn15Minutes,
        });

        const technicianData = response.data.technician as Itechnician;
        dispatch(setTechnicianData(technicianData));

        navigate("/technician/portal");
      } else {
        showToast({
          message: response.message,
          type: "error",
        });
      }
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message,
        type: "error",
      });
    }
  };

  return <Login role="TECHNICIAN" onsubmit={handleLoginSubmit} />;
};
