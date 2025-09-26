import React from "react";
import { AdminNavbar } from "../components/admin/AdminNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminFooter } from "../components/admin/AdminFooter";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
