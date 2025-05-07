import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const UserPublicRoute: React.FC = () => {
  const token = getAccessToken("user");

  if (token) {
    return <Navigate to="/user/home" />;
  }

  return <Outlet />;
};
