import { io, Socket } from "socket.io-client";
import { envConfig } from "../../config/env.config";

let socket: Socket | null = null;

export const connectSocket = (): Socket | null => {
  if (socket) return socket;

  socket = io(envConfig.apiUrl);

  if (socket) {
    socket.on("connect", () => {
      console.log("Connected to chat:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat");
    });
  }

  return socket;
};

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

export const stopListening = (): void => {
  if (socket) {
    socket.off("new_message");
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
