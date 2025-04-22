import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const TechnicianPrivateRoute: React.FC = () => {
  const token = getAccessToken("technician");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/technician/login" />;
};