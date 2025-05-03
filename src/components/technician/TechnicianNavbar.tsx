import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  User,
  Menu,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const TechnicianNavbar: React.FC = () => {
  const isVerified = useSelector(
    (state: RootState) => state.technician.technicianData?.is_verified || false
  );
  const navigate = useNavigate();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Style for disabled nav links
  const disabledStyle = !isVerified
    ? "text-gray-400 cursor-not-allowed"
    : "text-gray-700 hover:text-black";

  const handleNavigation = (path: string, allowUnverified: boolean = false) => {
    if (isVerified || allowUnverified) {
      navigate(path);
    }
  };

  return (
    <header className="bg-gray-100 py-6 px-6 shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">FIXIFY</h1>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex justify-center">
            <button
              onClick={() => handleNavigation("/technician/dashboard")}
              className={`${disabledStyle} text-base font-medium mx-8`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/technician/tasks")}
              className={`${disabledStyle} text-base font-medium mx-8`}
            >
              Tasks
            </button>
            <button
              onClick={() => handleNavigation("/technician/requests")}
              className={`${disabledStyle} text-base font-medium mx-8`}
            >
              Requests
            </button>
            <button
              onClick={() => handleNavigation("/technician/history")}
              className={`${disabledStyle} text-base font-medium mx-8`}
            >
              History
            </button>
          </div>
        </nav>

        <div className="flex items-center">
          <div className="relative mr-10" ref={notificationsRef}>
            <button
              onClick={() =>
                isVerified && setIsNotificationsOpen(!isNotificationsOpen)
              }
              className={`w-10 h-10 rounded-full ${isVerified ? "bg-gray-200" : "bg-gray-300"} flex items-center justify-center focus:outline-none relative ${!isVerified ? "cursor-not-allowed" : ""}`}
              disabled={!isVerified}
            >
              <Bell
                className={`h-6 w-6 ${isVerified ? "text-gray-600" : "text-gray-400"}`}
              />
              {isVerified && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              )}
            </button>

            {isNotificationsOpen && isVerified && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <button
                    onClick={() =>
                      handleNavigation("/technician/notifications/1")
                    }
                    className="w-full text-left block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                        <Info className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          New Service Request
                        </p>
                        <p className="text-sm text-gray-500">
                          You've been assigned a new plumbing repair job at 123
                          Main St.
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          30 minutes ago
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      handleNavigation("/technician/notifications/2")
                    }
                    className="w-full text-left block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Job Completed
                        </p>
                        <p className="text-sm text-gray-500">
                          Your report for the electrical work at 456 Oak Ave has
                          been approved.
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      handleNavigation("/technician/notifications/3")
                    }
                    className="w-full text-left block px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Schedule Update
                        </p>
                        <p className="text-sm text-gray-500">
                          Your upcoming HVAC installation has been rescheduled
                          for tomorrow at 2PM.
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Yesterday</p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="block px-4 py-2 text-center border-t border-gray-100">
                  <button
                    onClick={() =>
                      handleNavigation("/technician/notifications")
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none"
            >
              <User className="h-7 w-7 text-gray-600" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute -right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <button
                  onClick={() => handleNavigation("/technician/profile", true)}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-4 md:hidden text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-2">
          <div className="px-2 pt-2 pb-3 space-y-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search services..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => handleNavigation("/technician/dashboard")}
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${isVerified ? "text-gray-700 hover:text-black hover:bg-gray-50" : "text-gray-400 cursor-not-allowed"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("/technician/tasks")}
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${isVerified ? "text-gray-700 hover:text-black hover:bg-gray-50" : "text-gray-400 cursor-not-allowed"}`}
            >
              Tasks
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
