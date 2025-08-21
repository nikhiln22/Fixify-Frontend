import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authServices";
import { PrivateRouteProps } from "../types/component.types";
import cookie from "js-cookie";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = cookie.get("access_token");
    console.log("token in the private route:", token);

    if (token && isRoleMatch(token, role)) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    console.log(`No access token found for ${role}, trying to refresh...`);

    try {
      const newAccessToken = await authService.newRefreshToken();

      if (newAccessToken && isRoleMatch(newAccessToken, role)) {
        console.log(`New access token generated for ${role}!`);
        setIsAuthenticated(true);
      } else {
        console.log(`Refresh failed for ${role}`);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(`Refresh error for ${role}:`, error);
      setIsAuthenticated(false);
    }

    setIsChecking(false);
  };

  const isRoleMatch = (token: string, role: string) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role?.toUpperCase() === role;
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${role.toLowerCase()}/login`} />;
  }

  return <Outlet />;
};

export const UserPrivateRoute: React.FC = () => {
  return <PrivateRoute role="USER" />;
};

export const TechnicianPrivateRoute: React.FC = () => {
  return <PrivateRoute role="TECHNICIAN" />;
};

export const AdminPrivateRoute: React.FC = () => {
  return <PrivateRoute role="ADMIN" />;
};
