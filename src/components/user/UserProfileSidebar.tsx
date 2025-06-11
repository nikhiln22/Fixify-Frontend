import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, Wallet, Settings, HelpCircle } from "lucide-react";

export const UserProfileSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
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
      path: "/user/bookinglist",
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

  return (
    <aside className="w-72 bg-gray-50 h-full border-r border-gray-100">
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                    isActive
                      ? "bg-white text-gray-800 shadow-sm font-medium"
                      : "text-gray-700 hover:bg-white hover:shadow-sm"
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