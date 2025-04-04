import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const AdminPrivateRoute: React.FC = () => {
  const adminAccessToken = cookie.get("adminAccessToken");
  console.log("adminAccessToken:", adminAccessToken);
  return adminAccessToken ? <Outlet /> : <Navigate to="/admin/dashboard" />;
};
