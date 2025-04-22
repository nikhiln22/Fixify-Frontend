import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const TechnicianPublicRoute: React.FC = () => {
  const token = getAccessToken("technician");

  if (token) {
    return <Navigate to="/technician/portal" />;
  }

  return <Outlet />;
};
