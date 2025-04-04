import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import cookie from "js-cookie";

export const TechnicianPublicRoute: React.FC = () => {
  const technicianAccessToken = cookie.get("technicianAccessToken");
  console.log("technicianAccessToken:", technicianAccessToken);
  return technicianAccessToken ? <Navigate to="/technician/dashboard" /> : <Outlet />;
};
