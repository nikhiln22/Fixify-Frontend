import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { IChat } from "../models/chat";

export const getChatMessages = async (
  bookingId: string,
  role: string
): Promise<{
  data: IChat[];
  success: boolean;
  message?: string;
}> => {
  try {
    console.log(`fetching chat messages for ${role}`);

    const apiRoute = getApiRoute(role);

    const response = await axiosInstance.get(
      `${apiRoute}/chatmessages/${bookingId}`
    );
    console.log("chat messages response:", response);

    return {
      data: response.data.data || [],
      success: response.data.success || true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`error fetching chat messages for ${role}:`, error);
    return {
      data: [],
      success: false,
      message: "Failed to fetch messages",
    };
  }
};

export const sendChatMessage = async (
  bookingId: string,
  messageText: string,
  recipientId: string,
  role: string
): Promise<{
  data?: IChat;
  success: boolean;
  message?: string;
}> => {
  try {
    console.log(`sending chat message for ${role}`);

    const apiRoute = getApiRoute(role);
    const baseUrl = `${apiRoute}/sendchatmessages/${bookingId}`;

    const requestBody = {
      messageText,
      senderType: role,
      ...(role === "user"
        ? { technicianId: recipientId }
        : { userId: recipientId }),
    };

    console.log("Request body:", requestBody);

    const response = await axiosInstance.post(baseUrl, requestBody);

    console.log("send message response:", response);

    return {
      data: response.data.data,
      success: response.data.success || true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`error sending chat message for ${role}:`, error);
    throw error;
  }
};
