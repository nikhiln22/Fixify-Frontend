import axiosInstance from "../config/axios.config";
import { CHAT_API } from "../constants/apiRoutes";
import { IChat } from "../models/chat";

export const getChatMessages = async (
  bookingId: string
): Promise<{
  data: IChat[];
  success: boolean;
  message?: string;
}> => {
  try {
    console.log(`fetching chat messages`);

    const response = await axiosInstance.get(
      `${CHAT_API}/${bookingId}/history`
    );
    console.log("chat messages response:", response);

    return {
      data: response.data.data || [],
      success: response.data.success || true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`error fetching chat messages`, error);
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

    const baseUrl = `${CHAT_API}/${bookingId}/send`;

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
