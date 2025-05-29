import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/authUtils";
import { PublicRouteProps } from "../types/component.types";

const PublicRoute: React.FC<PublicRouteProps> = ({ role, redirectTo }) => {
  const token = getAccessToken(role);

  if (token) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

// Export specific public routes
export const UserPublicRoute: React.FC = () => {
  return <PublicRoute role="USER" redirectTo="/user/home" />;
};

export const TechnicianPublicRoute: React.FC = () => {
  return <PublicRoute role="TECHNICIAN" redirectTo="/technician/portal" />;
};

export const AdminPublicRoute: React.FC = () => {
  return <PublicRoute role="ADMIN" redirectTo="/admin/dashboard" />;
};
