import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const AdminPrivateRoute: React.FC = () => {
  const token = getAccessToken("admin");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/admin/login" />;
};

