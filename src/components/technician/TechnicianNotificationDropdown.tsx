import React, { useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import {
  listenForNotifications,
  stopListeningForNotifications,
  authenticateUser,
  connectSocket,
  markNotificationAsRead,
} from "../../utils/socket/socket";
import { useAppSelector } from "../../hooks/useRedux";

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

interface TechnicianNotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onNotificationClick: (notificationId: string) => void;
  onMarkAllRead: () => void;
  onNewNotification: (notification: Notification) => void;
}

export const TechnicianNotificationDropdown: React.FC<
  TechnicianNotificationDropdownProps
> = ({
  isOpen,
  onToggle,
  notifications,
  unreadCount,
  loading,
  onNotificationClick,
  onMarkAllRead,
  onNewNotification,
}) => {
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );

  // Initialize socket connection and listeners
  useEffect(() => {
    if (technicianData?._id) {
      // Connect socket and authenticate technician
      connectSocket();
      authenticateUser(technicianData._id, "technician");

      // Listen for real-time notifications
      listenForNotifications((newNotification) => {
        console.log("New notification received:", newNotification);

        // Pass new notification to parent component
        onNewNotification(newNotification);

        // Optional: Show browser notification
        if (Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "/favicon.ico",
          });
        }
      });
    }

    return () => {
      stopListeningForNotifications();
    };
  }, [technicianData?._id, onNewNotification]);

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    // Emit socket event to mark as read
    markNotificationAsRead(notificationId);

    // Call parent handler for API call
    onNotificationClick(notificationId);
  };

  const handleMarkAllRead = () => {
    // Call parent handler for API call
    onMarkAllRead();
  };

  const handleClose = () => {
    onToggle();
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none z-10 border border-gray-100">
          {/* Header with close button and mark all read */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-150"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4 text-gray-600" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-150"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors duration-150"
                >
                  <div className="flex items-start space-x-3">
                    {/* Individual tick mark for each notification */}
                    <button
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 flex-shrink-0 ${
                        notification.isRead
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                      }`}
                    >
                      {notification.isRead && <Check className="h-3 w-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
