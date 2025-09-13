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
import { TechnicianJobListing } from "../pages/Technician/technicianpages/TechnicianJobListing";
import { TechnicianBookingDetail } from "../pages/Technician/technicianpages/TechnicianBookingDetail";
import { TechnicianSubscription } from "../pages/Technician/technicianpages/TechnicianSubscription";

export const TechnicianRoutes: React.FC = () => {
  const user = useAppSelector(
    (state) => state.technician.technicianData?.username
  );

  return (
    <Routes>
      <Route element={<TechnicianPublicRoute />}>
        <Route path="login" element={<TechnicianLogin />} />
        <Route path="register" element={<TechnicianRegister />} />
        <Route path="otp" element={<TechnicianOtp />} />
        <Route path="forgotpassword" element={<TechnicianForgotPassword />} />
        <Route path="resetpassword" element={<TechnicianResetPassword />} />
      </Route>

      <Route element={<TechnicianPrivateRoute />}>
        <Route path="portal" element={<TechnicianPortal />} />
        <Route path="profile" element={<TechnicianProfile />} />
        <Route path="availability" element={<TechnicianAvailability />} />
        <Route path="earnings" element={<TechnicianEarnings />} />
        <Route path="jobs" element={<TechnicianJobListing />} />
        <Route
          path="jobdetails/:bookingId"
          element={<TechnicianBookingDetail />}
        />
        <Route path="subscription" element={<TechnicianSubscription />} />
      </Route>

      <Route
        path="*"
        element={<PageNotFound userName={user} userRole="technician" />}
      />
    </Routes>
  );
};
