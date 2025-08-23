import React, { useState, useEffect } from "react";
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
import { useAppSelector } from "../../hooks/useRedux";

const AdminNavbar: React.FC = () => {
  const adminData = useAppSelector((state) => state.admin.adminData);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = connectSocket();

    if (socket && adminData?._id) {
      authenticateUser(adminData._id, "admin");

      listenForNotifications((newNotification) => {
        handleNewNotification(newNotification);
      });
    }

    fetchNotifications();

    return () => {
      stopListeningForNotifications();
    };
  }, [adminData?._id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllUnreadNotifications("admin");
      console.log(
        "response in the get all notitificatios in the admin navabr:",
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
      const response = await markNotificationRead(notificationId, "admin");
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
  //       markNotificationRead(notif._id, "admin")
  //     );

  //     await Promise.all(markAllPromises);

  //     setNotifications((prev) =>
  //       prev.map((notif) => ({ ...notif, isRead: true }))
  //     );

  //     setUnreadCount(0);

  //     console.log("All notifications marked as read");
  //   } catch (error) {
  //     console.error("Error marking all notifications as read:", error);
  //   }
  // };

  const handleNewNotification = (newNotification: INotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => {
      return prev + 1;
    });
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md py-4 px-6 shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Logo role="admin" />

          <div className="flex items-center space-x-8">
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
                userType="admin"
              />

              <Dropdown role="admin" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminNavbar;
