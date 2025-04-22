import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const AdminPublicRoute: React.FC = () => {
  const token = getAccessToken("admin");

  if (token) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Outlet />;
};