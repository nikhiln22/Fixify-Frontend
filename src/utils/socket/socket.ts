import { io, Socket } from "socket.io-client";
import { envConfig } from "../../config/env.config";

export interface ISocketNotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
  recipientId: string;
  recipientType: "user" | "admin" | "technician";
}

let socket: Socket | null = null;

export const connectSocket = (): Socket | null => {
  if (socket) return socket;

  socket = io(envConfig.apiUrl);

  if (socket) {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });
  }

  return socket;
};

// ===== USER AUTHENTICATION =====
export const authenticateUser = (
  userId: string,
  userType: "user" | "admin" | "technician"
): void => {
  if (socket) {
    socket.emit("user_authenticate", { userId, userType });
    console.log(`Authenticated user ${userId} as ${userType}`);
  }
};

// ===== CHAT FUNCTIONS =====
export const joinChat = (bookingId: string): void => {
  if (socket) {
    socket.emit("join_chat", bookingId);
    console.log("Joined chat for booking:", bookingId);
  }
};

export const leaveChat = (bookingId: string): void => {
  if (socket) {
    socket.emit("leave_chat", bookingId);
    console.log("Left chat for booking:", bookingId);
  }
};

export const sendMessage = (
  bookingId: string,
  messageText: string,
  senderType: "user" | "technician"
): void => {
  if (socket) {
    socket.emit("send_message", {
      bookingId,
      messageText,
      senderType,
    });
  }
};

export const listenForMessages = (callback: (message: any) => void): void => {
  if (socket) {
    socket.on("new_message", callback);
  }
};

export const stopListeningForMessages = (): void => {
  if (socket) {
    socket.off("new_message");
  }
};

// ===== NOTIFICATION FUNCTIONS =====
export const listenForNotifications = (
  callback: (notification: ISocketNotificationData) => void
): void => {
  if (socket) {
    socket.on("new_notification", callback);
    console.log("Started listening for notifications");
  }
};

export const stopListeningForNotifications = (): void => {
  if (socket) {
    socket.off("new_notification");
    console.log("Stopped listening for notifications");
  }
};

export const markNotificationAsRead = (notificationId: string): void => {
  if (socket) {
    socket.emit("mark_notification_read", notificationId);
    console.log(`Marked notification ${notificationId} as read`);
  }
};

// ===== GENERAL FUNCTIONS =====
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};
