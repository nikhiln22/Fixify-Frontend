import React, { useState } from "react";
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
import Modal from "../../components/common/Modal";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

export const UserNavbar: React.FC = () => {
  const logout = useLogout();
  const userData = useAppSelector((state) => state.user.userData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/user/home" className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-cyan-500">F</span>
                  <span className="text-2xl font-bold text-slate-800 relative">
                    I
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-sm"></div>
                  </span>
                  <span className="text-2xl font-bold text-slate-800">X</span>
                  <span className="text-2xl font-bold text-slate-800">I</span>
                  <span className="text-2xl font-bold text-cyan-500">F</span>
                  <span className="text-2xl font-bold text-slate-800">Y</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="relative flex-grow max-w-lg mx-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Search services..."
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 bg-gray-50/50 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                to="/user/home"
                className="text-gray-700 hover:text-cyan-600 text-base font-medium transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/user/categories"
                className="text-gray-700 hover:text-cyan-600 text-base font-medium transition-colors duration-200 relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            <div className="flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    3
                  </span>
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black/5 focus:outline-none z-10 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <a
                        href="#"
                        className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors duration-150"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-1.5">
                            <Info className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Booking Confirmed
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Your plumbing service has been confirmed for
                              tomorrow.
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors duration-150"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-1.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Payment Successful
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Your payment for electrical service has been
                              processed.
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                              Yesterday
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1.5">
                            <Clock className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Service Reminder
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Your AC maintenance is due next week.
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="block px-4 py-3 text-center border-t border-gray-100">
                      <a
                        href="#"
                        className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center focus:outline-none overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {userData?.image ? (
                    <img
                      src={buildCloudinaryUrl(userData.image)}
                      alt={userData.username || "User"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black/5 focus:outline-none z-10 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden mr-3">
                          {userData?.image ? (
                            <img
                              src={buildCloudinaryUrl(userData.image)}
                              alt={userData.username || "User"}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userData?.username || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userData?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      My Profile
                    </Link>
                    <div className="border-t border-gray-100 mt-1"></div>
                    <a
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                      onClick={handleLogoutClick}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search services..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Link
                to="/user/home"
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50 transition-all duration-200"
              >
                Home
              </Link>
              <Link
                to="/user/categories"
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-cyan-600 hover:bg-gray-50 transition-all duration-200"
              >
                Services
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
