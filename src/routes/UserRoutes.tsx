import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserPrivateRoute } from "./PrivateRoutes";
import { UserPublicRoute } from "./PublicRoutes";
import { UserLogin } from "../pages/User/auth/UserLogin";
import { UserRegister } from "../pages/User/auth/UserRegister";
import { UserOtp } from "../pages/User/auth/UserOtp";
import { UserForgotPassword } from "../pages/User/auth/UserForgotPassword";
import { UserResetPassword } from "../pages/User/auth/UserResetPassword";
import { UserHome } from "../pages/User/userpages/UserHome";
import { UserCategory } from "../pages/User/userpages/UserCategory";
import { UserService } from "../pages/User/userpages/UserService";
import { UserProfile } from "../pages/User/userpages/UserProfile";
import { UserServiceDetails } from "../pages/User/userpages/UserServiceDetails";
import { PageNotFound } from "../components/common/PageNotFound";
import { useAppSelector } from "../hooks/useRedux";
import { UserBooking } from "../pages/User/userpages/UserBooking";
import { UserBookingSuccess } from "../pages/User/userpages/UserBookingSuccess";
import { UserBookingsList } from "../pages/User/userpages/UserBookingsList";
import { BookingDetailsPage } from "../pages/User/userpages/UserBookingDetail";
import { UserWallet } from "../pages/User/userpages/UserWallet";

export const UserRoutes: React.FC = () => {
  const user = useAppSelector((state) => state.user.userData);

  return (
    <Routes>
      <Route element={<UserPublicRoute />}>
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
        <Route path="otp" element={<UserOtp />} />
        <Route path="forgotpassword" element={<UserForgotPassword />} />
        <Route path="resetpassword" element={<UserResetPassword />} />
      </Route>

      <Route element={<UserPrivateRoute />}>
        <Route path="home" element={<UserHome />} />
        <Route path="categories" element={<UserCategory />} />
        <Route path="services" element={<UserService />} />
        <Route path="services/:categoryId" element={<UserService />} />
        <Route
          path="servicedetails/:serviceId"
          element={<UserServiceDetails />}
        />
        <Route path="profile" element={<UserProfile />} />
        <Route path="booking" element={<UserBooking />} />
        <Route path="bookingsuccess" element={<UserBookingSuccess />} />
        <Route path="bookings" element={<UserBookingsList />} />
        <Route path="bookings/:id" element={<BookingDetailsPage />} />
        <Route path="wallet" element={<UserWallet />} />
      </Route>

      <Route
        path="*"
        element={<PageNotFound userName={user?.username} userRole="user" />}
      />
    </Routes>
  );
};
