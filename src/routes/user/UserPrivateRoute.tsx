import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const UserPrivateRoute: React.FC = () => {
  const userAccessToken = cookie.get("user_access_token");
  console.log("userAccessToken:", userAccessToken);
  return userAccessToken ? <Outlet /> : <Navigate to="/user/login" />;
};
