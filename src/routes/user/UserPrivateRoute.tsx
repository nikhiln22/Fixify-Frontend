import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const UserPrivateRoute: React.FC = () => {
  const userAccessToken = cookie.get("userAccessToken");
  console.log("accessToken:", userAccessToken);
  return userAccessToken ? <Outlet /> : <Navigate to="/user/login" />;
};
