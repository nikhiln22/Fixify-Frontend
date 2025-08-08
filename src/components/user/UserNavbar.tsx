import React, { useState, useEffect } from "react";
import { Search, User, Menu } from "lucide-react";
import useLogout from "../../hooks/useLogout";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import Modal from "../../components/common/Modal";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import { NotificationDropdown } from "../../components/common/NotificationDropDown";
import {
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
} from "../../services/user.services";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
  recipientId: string;
  recipientType: "user" | "admin" | "technician";
  isRead: boolean;
}

export const UserNavbar: React.FC = () => {
  const logout = useLogout();
  const userData = useAppSelector((state) => state.user.userData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();

      if (response && response.success) {
        setNotifications(response.data || []);

        const unread =
          response.data?.filter((notif: Notification) => !notif.isRead)
            .length || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationsCount();

      if (response && response.success) {
        setUnreadCount(response.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const response = await markNotificationRead(notificationId);

      if (response && response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));

        console.log("Notification marked as read:", notificationId);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notif) => !notif.isRead
      );

      const markAllPromises = unreadNotifications.map((notif) =>
        markNotificationRead(notif.id)
      );

      await Promise.all(markAllPromises);

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      setUnreadCount(0);

      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNewNotification = (newNotification: Notification) => {
    setNotifications((prev) => [newNotification, ...prev]);

    setUnreadCount((prev) => prev + 1);
  };

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
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)}
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                onNotificationClick={handleNotificationClick}
                onMarkAllRead={handleMarkAllRead}
                onNewNotification={handleNewNotification}
              />

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
