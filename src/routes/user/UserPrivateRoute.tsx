import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/authUtils";

export const UserPrivateRoute: React.FC = () => {
  const token = getAccessToken("user");

  if (token) {
    return <Outlet />;
  }
  
  return <Navigate to="/user/login" />;
};
