import React, { useState, useEffect } from "react";
import { Logo } from "../common/Logo";
import { Dropdown } from "../common/DropDown";
import { NotificationDropdown } from "../common/NotificationDropDown";
import {
  getAllNotifications,
  getUnreadNotificationsCount,
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
    console.log("🔧 AdminNavbar useEffect running");
    console.log("📝 AdminData:", adminData);

    const socket = connectSocket();
    console.log("🔌 Socket connection:", socket?.connected, "ID:", socket?.id);

    if (socket && adminData?._id) {
      console.log("🔐 Authenticating admin with ID:", adminData._id);
      console.log("🏠 Will join room:", `admin_${adminData._id}`);

      authenticateUser(adminData._id, "admin");

      console.log("👂 Setting up notification listener");
      listenForNotifications((newNotification) => {
        console.log("🔔 NEW NOTIFICATION RECEIVED:", newNotification);
        console.log("📬 Current notification count before:", unreadCount);
        handleNewNotification(newNotification);
      });
    } else {
      console.log("❌ Cannot authenticate - Missing:", {
        hasSocket: !!socket,
        hasAdminId: !!adminData?._id,
        adminId: adminData?._id,
      });
    }

    fetchNotifications();
    fetchUnreadCount();

    return () => {
      console.log("🧹 Cleaning up notification listeners");
      stopListeningForNotifications();
    };
  }, [adminData?._id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications("admin");

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
      const response = await getUnreadNotificationsCount("admin");

      if (response && response.success) {
        setUnreadCount(response.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const response = await markNotificationRead(notificationId, "admin");

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
        markNotificationRead(notif.id, "admin")
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
    console.log("📝 Adding notification to list:", newNotification);
    console.log("📊 Unread count before:", unreadCount);

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => {
      console.log("📊 Unread count after:", prev + 1);
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
                onMarkAllRead={handleMarkAllRead}
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
