import React from "react";
import { Route, Routes } from "react-router-dom";
import { TechnicianPublicRoute } from "./TechnicianPublicRoute";
import { TechnicianLogin } from "../../pages/Technician/auth/TechnicianLogin";
import { TechnicianRegister } from "../../pages/Technician/auth/TechnicianRegister";
import { TechnicianOtp } from "../../pages/Technician/auth/TechnicianOtp";
import { TechnicianForgotPassword } from "../../pages/Technician/auth/TechnicianForgotPassword";
import { TechnicianResetPassword } from "../../pages/Technician/auth/TechnicianResetPassword";
import { TechnicianPrivateRoute } from "./TechnicianPrivateRoute";
import { TechnicianPortal } from "../../pages/Technician/technicianpages/TechnicianPortal";
import TechnicianProfile from "../../pages/Technician/technicianpages/TechnicianProfile";

export const TechnicianRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Technician public routes */}
      <Route element={<TechnicianPublicRoute />}>
        <Route path="/technician/login" element={<TechnicianLogin />} />
        <Route path="/technician/register" element={<TechnicianRegister />} />
        <Route path="/technician/otp" element={<TechnicianOtp />} />
        <Route
          path="/technician/forgotpassword"
          element={<TechnicianForgotPassword />}
        />
        <Route
          path="/technician/resetpassword"
          element={<TechnicianResetPassword />}
        />
      </Route>

      {/* Technician private routes */}
      <Route element={<TechnicianPrivateRoute />}>
        <Route path="/technician/portal" element={<TechnicianPortal />} />
        <Route path="/technician/profile" element={<TechnicianProfile />} />
      </Route>
    </Routes>
  );
};
