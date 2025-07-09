import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Briefcase,
  Grid3x3,
  Wrench,
  ClipboardList,
  Tag,
  Ticket,
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
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Grid3x3 size={20} />
              <span>Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/services"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Wrench size={20} />
              <span>Services</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <ClipboardList size={20} />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/offers"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Tag size={20} />
              <span>Offers</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/coupons"
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                  isActive
                    ? "bg-white text-gray-800 shadow-sm font-medium"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`
              }
            >
              <Ticket size={20} />
              <span>Coupons</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
