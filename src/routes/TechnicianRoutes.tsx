import React from "react";
import { Route, Routes } from "react-router-dom";
import { TechnicianPrivateRoute } from "./PrivateRoutes";
import { TechnicianPublicRoute } from "./PublicRoutes";
import { TechnicianLogin } from "../pages/Technician/auth/TechnicianLogin";
import { TechnicianRegister } from "../pages/Technician/auth/TechnicianRegister";
import { TechnicianOtp } from "../pages/Technician/auth/TechnicianOtp";
import { TechnicianForgotPassword } from "../pages/Technician/auth/TechnicianForgotPassword";
import { TechnicianResetPassword } from "../pages/Technician/auth/TechnicianResetPassword";
import { TechnicianPortal } from "../pages/Technician/technicianpages/TechnicianPortal";
import { TechnicianProfile } from "../pages/Technician/technicianpages/TechnicianProfile";
import { TechnicianAvailability } from "../pages/Technician/technicianpages/TechnicianAvailability";
import { TechnicianEarnings } from "../pages/Technician/technicianpages/TechnicianEarnings";
import { PageNotFound } from "../components/common/PageNotFound";
import { useAppSelector } from "../hooks/useRedux";

export const TechnicianRoutes: React.FC = () => {
  const user = useAppSelector(
    (state) => state.technician.technicianData?.username
  );
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
        <Route
          path="/technician/availability"
          element={<TechnicianAvailability />}
        />
        <Route path="/technician/earnings" element={<TechnicianEarnings />} />
      </Route>
      <Route
        path="/technician/*"
        element={<PageNotFound userName={user} userRole="technician" />}
      />
    </Routes>
  );
};
