import React from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Crown,
  Puzzle,
  LucideIcon,
} from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    {
      id: "technicians",
      label: "Technicians",
      icon: UserCog,
      path: "/admin/technicians",
    },
    {
      id: "applicants",
      label: "Applicants",
      icon: FileText,
      path: "/admin/applicants",
    },
    {
      id: "jobdesignations",
      label: "Job Designations",
      icon: Briefcase,
      path: "/admin/jobdesignations",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid3x3,
      path: "/admin/categories",
    },
    {
      id: "services",
      label: "Services",
      icon: Wrench,
      path: "/admin/services",
    },

    { id: "parts", label: "Parts", icon: Puzzle, path: "/admin/parts" },

    {
      id: "bookings",
      label: "Bookings",
      icon: ClipboardList,
      path: "/admin/bookings",
    },
    { id: "offers", label: "Offers", icon: Tag, path: "/admin/offers" },
    { id: "coupons", label: "Coupons", icon: Ticket, path: "/admin/coupons" },
    {
      id: "subscription Plans",
      label: "Subscription Plans",
      icon: Crown,
      path: "/admin/subscriptionplans",
    },
  ];

  const isItemActive = (item: SidebarItem) => {
    if (item.id === "bookings")
      return location.pathname.startsWith("/admin/bookings");
    if (item.id === "subscription Plans")
      return location.pathname.startsWith("/admin/subscription");
    if (item.id === "applicants")
      return location.pathname.startsWith("/admin/applicants");
    if (item.id === "technicians")
      return location.pathname.startsWith("/admin/technicians");
    if (item.id === "parts")
      return location.pathname.startsWith("/admin/parts");
    return location.pathname === item.path;
  };

  return (
    <aside className="w-72 bg-gray-50 h-full border-r border-gray-100">
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={() =>
                    `flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                      isActive
                        ? "bg-white text-gray-800 shadow-sm font-medium"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
