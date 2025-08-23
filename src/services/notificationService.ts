import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";

export const getAllUnreadNotifications = async (role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(`${apiRoute}/notifications`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the notifications:", error);
  }
};

export const markNotificationRead = async (
  notificationId: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/marknotificationread/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while marking the notification as read");
  }
};
