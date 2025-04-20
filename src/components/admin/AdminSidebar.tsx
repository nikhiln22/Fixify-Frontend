import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  UserCircle,
  Briefcase,
} from "lucide-react";

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-50 h-full border-r border-gray-100">
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/userslist"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/technicianlist"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <UserCog size={20} />
              <span>Technicians</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/applicantslist"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <FileText size={20} />
              <span>Applicants</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/jobdesignations"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Briefcase size={20} />
              <span>Job Designations</span>
            </NavLink>
          </li>
          <li className="mt-6 pt-6 border-t border-gray-200">
            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <UserCircle size={20} />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
