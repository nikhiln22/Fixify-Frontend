import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserPublicRoute } from "./UserPublicRoute";
import { UserLogin } from "../../pages/User/auth/UserLogin";
import { UserRegister } from "../../pages/User/auth/UserRegister";
import { UserOtp } from "../../pages/User/auth/UserOtp";
import { UserForgotPassword } from "../../pages/User/auth/UserForgotPassword";
import { UserResetPassword } from "../../pages/User/auth/UserResetPassword";
import { UserPrivateRoute } from "./UserPrivateRoute";
import { UserHome } from "../../pages/User/userpages/UserHome";
import { UserService } from "../../pages/User/userpages/UserService";

export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      {/* user public routes */}
      <Route element={<UserPublicRoute />}>
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/otp" element={<UserOtp />} />
        <Route path="/user/forgotpassword" element={<UserForgotPassword />} />
        <Route path="/user/resetpassword" element={<UserResetPassword />} />
      </Route>

      {/* user private routes */}
      <Route element={<UserPrivateRoute />}>
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/services" element={<UserService />} />
      </Route>
    </Routes>
  );
};
