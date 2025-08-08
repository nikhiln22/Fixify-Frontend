import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Settings,
  Clock,
  Briefcase,
  IndianRupee,
  CreditCard,
} from "lucide-react";

export const TechnicianProfileSidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    {
      id: "profile",
      label: "Profile Info",
      icon: User,
      path: "/technician/profile",
    },
    {
      id: "availability",
      label: "Availability & Schedule",
      icon: Clock,
      path: "/technician/availability",
    },
    {
      id: "jobs",
      label: "My Jobs",
      icon: Briefcase,
      path: "/technician/jobs",
    },
    {
      id: "Wallet",
      label: "Wallet & Payments",
      icon: IndianRupee,
      path: "/technician/earnings",
    },
    {
      id: "subscription",
      label: "My Subscription",
      icon: CreditCard,
      path: "/technician/subscription",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
      path: "/technician/settings",
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
