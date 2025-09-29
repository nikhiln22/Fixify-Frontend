import axiosInstance from "../config/axios.config";
import { NOTIFICATIONS_API } from "../constants/apiRoutes";

export const getAllUnreadNotifications = async () => {
  try {
    const response = await axiosInstance.get(`${NOTIFICATIONS_API}/unread`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the notifications:", error);
  }
};

export const markNotificationRead = async (notificationId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${NOTIFICATIONS_API}/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while marking the notification as read:", error);
  }
};
