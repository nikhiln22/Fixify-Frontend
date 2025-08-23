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
import { INotification } from "../../models/notification";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  onNotificationClick: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  onNewNotification: (notification: INotification) => void;
  disabled?: boolean;
  userType?: "user" | "technician" | "admin";
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onToggle,
  notifications,
  unreadCount,
  loading,
  onNotificationClick,
  // onMarkAllRead,
  onNewNotification,
  disabled = false,
  userType = "user",
}) => {
  const userData = useAppSelector((state) => state.user.userData);
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );
  const adminData = useAppSelector((state) => state.admin.adminData);

  // Initialize socket connection and listeners
  useEffect(() => {
    if (!disabled) {
      let userId;
      if (userType === "user") {
        userId = userData?._id;
      } else if (userType === "technician") {
        userId = technicianData?._id;
      } else if (userType === "admin") {
        userId = adminData?._id;
      }

      if (userId) {
        // Connect socket and authenticate user
        connectSocket();
        authenticateUser(userId, userType);

        // Listen for real-time notifications
        listenForNotifications((newNotification) => {
          console.log("New notification received:", newNotification);

          // Pass new notification to parent component
          onNewNotification(newNotification);
        });
      }
    }

    return () => {
      stopListeningForNotifications();
    };
  }, [
    userData?._id,
    technicianData?._id,
    adminData?._id,
    onNewNotification,
    disabled,
    userType,
  ]);

  useEffect(() => {
    if (!disabled && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [disabled]);

  const handleNotificationClick = (notificationId: string) => {
    if (!disabled) {
      markNotificationAsRead(notificationId);
      onNotificationClick(notificationId);
    }
  };

  // const handleMarkAllRead = () => {
  //   if (!disabled) {
  //     onMarkAllRead();
  //   }
  // };

  const handleClose = () => {
    if (!disabled) {
      onToggle();
    }
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
        onClick={disabled ? undefined : onToggle}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
          disabled
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
        }`}
        disabled={disabled}
      >
        <Bell
          className={`h-5 w-5 ${disabled ? "text-gray-400" : "text-gray-600"}`}
        />
        {!disabled && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {!disabled && isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl ring-1 ring-black/5 focus:outline-none z-10 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  // onClick={handleMarkAllRead}
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
                <p className="text-sm text-gray-500">No unread notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors duration-150 relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-8">
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

                    <button
                      onClick={() => handleNotificationClick(notification._id)}
                      className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4 text-gray-400 hover:text-green-500" />
                    </button>
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
