import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import { Logo } from "../common/Logo";
import { Dropdown } from "../common/DropDown";
import { NotificationDropdown } from "../common/NotificationDropDown";
import {
  getAllUnreadNotifications,
  markNotificationRead,
} from "../../services/notificationService";
import { INotification } from "../../models/notification";
import {
  connectSocket,
  authenticateUser,
  listenForNotifications,
  stopListeningForNotifications,
} from "../../utils/socket/socket";

export const TechnicianNavbar: React.FC = () => {
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );
  const isVerified = technicianData?.is_verified || false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = connectSocket();

    if (socket && technicianData?._id && isVerified) {
      authenticateUser(technicianData._id, "technician");

      listenForNotifications((newNotification) => {
        handleNewNotification(newNotification);
      });
    }

    if (isVerified) {
      fetchNotifications();
    }

    return () => {
      stopListeningForNotifications();
    };
  }, [technicianData?._id, isVerified]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllUnreadNotifications();
      console.log(
        "response in the get all notifications in the technician navbar:",
        response
      );

      if (response && response.success) {
        setNotifications(response.data || []);
        const unread = response.data.length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const response = await markNotificationRead(notificationId);
      console.log("response from the handle notification click:", response);

      if (response && response.success) {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));

        console.log("Notification marked as read:", notificationId);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // const handleMarkAllRead = async () => {
  //   try {
  //     const unreadNotifications = notifications.filter(
  //       (notif) => !notif.isRead
  //     );

  //     const markAllPromises = unreadNotifications.map((notif) =>
  //       markNotificationRead(notif._id, "technician")
  //     );

  //     await Promise.all(markAllPromises);

  //     setNotifications([]);
  //     setUnreadCount(0);

  //     console.log("All notifications marked as read");
  //   } catch (error) {
  //     console.error("Error marking all notifications as read:", error);
  //   }
  // };

  const handleNewNotification = (newNotification: INotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const disabledStyle = !isVerified
    ? "text-gray-400 cursor-not-allowed pointer-events-none"
    : "text-gray-700 hover:text-cyan-600 transition-colors duration-200";

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Logo role="technician" />

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                to={isVerified ? "/technician/portal" : "#"}
                className={`${disabledStyle} text-base font-medium relative group`}
              >
                Dashboard
                {isVerified && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                )}
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
                // onMarkAllRead={handleMarkAllRead}
                onNewNotification={handleNewNotification}
                disabled={!isVerified}
                userType="technician"
              />

              <Dropdown role="technician" />

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
              <Link
                to={isVerified ? "/technician/portal" : "#"}
                className={`block px-4 py-3 rounded-xl text-base font-medium ${disabledStyle} hover:bg-gray-50 transition-all duration-200`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
