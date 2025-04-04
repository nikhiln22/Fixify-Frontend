import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const UserPublicRoute: React.FC = () => {
  const userAccessToken = cookie.get("userAccessToken");
  console.log("accessToken:", userAccessToken);
  return userAccessToken ? <Navigate to="/user/home" /> : <Outlet />;
};
