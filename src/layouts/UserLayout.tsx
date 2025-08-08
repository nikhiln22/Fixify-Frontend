import React from "react";
import { UserNavbar } from "../components/user/UserNavbar";
import { UserFooter } from "../components/user/UserFooter";

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <UserNavbar />
      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.02),transparent_50%)] pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </main>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
