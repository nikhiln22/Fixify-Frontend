import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { NotificationDropdown } from "../../components/common/NotificationDropDown";
import { Dropdown } from "../../components/common/DropDown";
import { Logo } from "../common/Logo";
import {
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
} from "../../services/notificationService";
import { INotification } from "../../models/notification";

export const UserNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications("user");

      if (response && response.success) {
        setNotifications(response.data || []);

        const unread =
          response.data?.filter((notif: INotification) => !notif.isRead)
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
      const response = await getUnreadNotificationsCount("user");

      if (response && response.success) {
        setUnreadCount(response.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const response = await markNotificationRead(notificationId, "user");

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
        markNotificationRead(notif.id, "user")
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

  const handleNewNotification = (newNotification: INotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Logo role="user" />

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

              <Dropdown role="user" />

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
    </>
  );
};
