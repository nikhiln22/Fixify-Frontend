import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Settings,
  Calendar,
  Wallet,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

export const UserProfileSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: "profile",
      label: "Profile Info",
      icon: User,
      path: "/user/profile",
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: Calendar,
      path: "/user/bookings",
    },
    {
      id: "wallet",
      label: "Wallet & Payments",
      icon: Wallet,
      path: "/user/wallet",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
      path: "/user/settings",
    },
    {
      id: "support",
      label: "Help & Support",
      icon: HelpCircle,
      path: "/user/support",
    },
  ];

  const isItemActive = (item: SidebarItem) => {
    if (item.id === "bookings") {
      return location.pathname.startsWith("/user/bookings");
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
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                    isActive
                      ? "bg-gray-50 text-gray-800 shadow-sm font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
