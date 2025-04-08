import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const UserPublicRoute: React.FC = () => {
  const userAccessToken = cookie.get("user_access_token");
  console.log("userAccessToken:", userAccessToken);
  return userAccessToken ? <Navigate to="/user/home" /> : <Outlet />;
};
