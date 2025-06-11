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
import UserBookingsList from "../pages/User/userpages/UserBookingsList";
import { BookingDetailsPage } from "../pages/User/userpages/UserBookingDetail";

export const UserRoutes: React.FC = () => {
  const user = useAppSelector((state) => state.user.userData);

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
        <Route path="/user/categories" element={<UserCategory />} />
        <Route path="/user/services/:categoryId" element={<UserService />} />
        <Route
          path="/user/servicedetails/:serviceId"
          element={<UserServiceDetails />}
        />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/booking" element={<UserBooking />} />
        <Route path="/user/bookingsuccess" element={<UserBookingSuccess />} />
        <Route path="/user/bookinglist" element={<UserBookingsList />} />
        <Route path="/user/bookingdetails/:bookingId" element={<BookingDetailsPage />} />
      </Route>

      {/* page not found */}
      <Route
        path="/user/*"
        element={<PageNotFound userName={user?.username} userRole="user" />}
      />
    </Routes>
  );
};
