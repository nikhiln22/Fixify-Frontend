import React from "react";
import { TechnicianNavbar } from "../components/technician/TechnicianNavbar";
import { TechnicianFooter } from "../components/technician/TechnicianFooter";

const TechnicianLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TechnicianNavbar />
      <main className="flex-grow p-4 overflow-y-auto">{children}</main>
      <TechnicianFooter />
    </div>
  );
};

export default TechnicianLayout;
