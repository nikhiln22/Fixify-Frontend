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
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import Modal from "../common/Modal";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

export const TechnicianNavbar: React.FC = () => {
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );
  const isVerified = technicianData?.is_verified || false;
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const handleLogoutClick = () => {
    setIsUserDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const disabledStyle = !isVerified
    ? "text-gray-400 cursor-not-allowed"
    : "text-gray-700 hover:text-black";

  return (
    <>
      <header className="bg-gray-100 py-6 px-6 shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">FIXIFY</h1>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex justify-center">
              <Link
                to={isVerified ? "/technician/portal" : "#"}
                className={`${disabledStyle} text-base font-medium mx-8 pointer-events-${isVerified ? "auto" : "none"}`}
              >
                Dashboard
              </Link>
              <Link
                to={isVerified ? "/technician/tasks" : "#"}
                className={`${disabledStyle} text-base font-medium mx-8 pointer-events-${isVerified ? "auto" : "none"}`}
              >
                Tasks
              </Link>
              <Link
                to={isVerified ? "/technician/requests" : "#"}
                className={`${disabledStyle} text-base font-medium mx-8 pointer-events-${isVerified ? "auto" : "none"}`}
              >
                Requests
              </Link>
              <Link
                to={isVerified ? "/technician/history" : "#"}
                className={`${disabledStyle} text-base font-medium mx-8 pointer-events-${isVerified ? "auto" : "none"}`}
              >
                History
              </Link>
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
                    <Link
                      to={isVerified ? "/technician/notifications/1" : "#"}
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
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
                            You've been assigned a new plumbing repair job at
                            123 Main St.
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            30 minutes ago
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={isVerified ? "/technician/notifications/2" : "#"}
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
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
                            Your report for the electrical work at 456 Oak Ave
                            has been approved.
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={isVerified ? "/technician/notifications/3" : "#"}
                      className="block px-4 py-3 hover:bg-gray-50"
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
                          <p className="mt-1 text-xs text-gray-400">
                            Yesterday
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="block px-4 py-2 text-center border-t border-gray-100">
                    <Link
                      to={isVerified ? "/technician/notifications" : "#"}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
              >
                {isVerified && technicianData?.image ? (
                  <img
                    src={buildCloudinaryUrl(technicianData.image)}
                    alt={technicianData.username || "Technician"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-7 w-7 text-gray-600" />
                )}
              </button>

              {isUserDropdownOpen && (
                <div className="absolute -right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {isVerified && (
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-3">
                          {technicianData?.image ? (
                            <img
                              src={buildCloudinaryUrl(technicianData.image)}
                              alt={technicianData.username || "Technician"}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {technicianData?.username || "Technician"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {technicianData?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Link
                    to="/technician/profile"
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
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
              <Link
                to={isVerified ? "/technician/portal" : "#"}
                className={`w-full block px-3 py-2 rounded-md text-base font-medium text-left ${isVerified ? "text-gray-700 hover:text-black hover:bg-gray-50" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
              >
                Dashboard
              </Link>
              <Link
                to={isVerified ? "/technician/tasks" : "#"}
                className={`w-full block px-3 py-2 rounded-md text-base font-medium text-left ${isVerified ? "text-gray-700 hover:text-black hover:bg-gray-50" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
              >
                Tasks
              </Link>
            </div>
          </div>
        )}
      </header>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        title="Confirm Logout"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        confirmButtonColor="red"
        className="max-w-md"
      >
        Are you sure you want to logout?
      </Modal>
    </>
  );
};
