import React from "react";
import { Login } from "../../../components/auth/Login";

export const AdminLogin: React.FC = () => {
  return (
    <div>
      <Login role="ADMIN" />
    </div>
  );
};
