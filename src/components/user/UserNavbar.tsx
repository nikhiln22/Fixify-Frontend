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

export const UserNavbar: React.FC = () => {
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-gray-100 py-6 px-6 shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">FIXIFY</h1>
        </div>

        <div className="relative flex-grow max-w-md mx-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search services..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <nav className="hidden md:flex items-center mr-6">
            <a
              href="#"
              className="text-gray-700 hover:text-black text-base font-medium mr-12"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black text-base font-medium mr-12"
            >
              Services
            </a>
          </nav>

          <div className="flex items-center">
            <div className="relative mr-10">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none relative"
              >
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <a
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                          <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Booking Confirmed
                          </p>
                          <p className="text-sm text-gray-500">
                            Your plumbing service has been confirmed for
                            tomorrow.
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Payment Successful
                          </p>
                          <p className="text-sm text-gray-500">
                            Your payment for electrical service has been
                            processed.
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Yesterday
                          </p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                      <div className="flex">
                        <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                          <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Service Reminder
                          </p>
                          <p className="text-sm text-gray-500">
                            Your AC maintenance is due next week.
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            2 days ago
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="block px-4 py-2 text-center border-t border-gray-100">
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
                className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none"
              >
                <User className="h-7 w-7 text-gray-600" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute -right-0 top-14 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Bookings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Sign out
                  </a>
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
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
            >
              Services
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
