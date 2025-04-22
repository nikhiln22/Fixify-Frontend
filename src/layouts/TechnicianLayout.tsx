import React from "react";
import { TechnicianNavbar } from "../components/technician/TechnicianNavbar";
import { TechnicianFooter } from "../components/technician/TechnicianFooter";

interface TechnicianLayoutProps {
  children: React.ReactNode;
  isVerified?: boolean;
}

const TechnicianLayout: React.FC<TechnicianLayoutProps> = ({ 
  children, 
  isVerified = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TechnicianNavbar isVerified={isVerified} />
      <main className="flex-grow p-4 overflow-y-auto">{children}</main>
      <TechnicianFooter />
    </div>
  );
};

export default TechnicianLayout;