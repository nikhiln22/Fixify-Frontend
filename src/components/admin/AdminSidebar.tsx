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
  Crown,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/userslist",
    },
    {
      id: "technicians",
      label: "Technicians",
      icon: UserCog,
      path: "/admin/technicianlist",
    },
    {
      id: "applicants",
      label: "Applicants",
      icon: FileText,
      path: "/admin/applicantslist",
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
    {
      id: "bookings",
      label: "Bookings",
      icon: ClipboardList,
      path: "/admin/bookings",
    },
    {
      id: "offers",
      label: "Offers",
      icon: Tag,
      path: "/admin/offers",
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: Ticket,
      path: "/admin/coupons",
    },
    {
      id: "subscription Plans",
      label: "Subscription Plans",
      icon: Crown,
      path: "/admin/subscriptionplans",
    },
  ];

  const isItemActive = (item: any) => {
    if (item.id === "bookings") {
      return location.pathname.startsWith("/admin/bookings");
    }
    if (item.id === "subscription Plans") {
      return location.pathname.startsWith("/admin/subscription");
    }
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

export default AdminSidebar;
