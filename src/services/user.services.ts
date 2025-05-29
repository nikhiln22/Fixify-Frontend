import axiosInstance from "../config/axios.config";
import { UserProfileResponse } from "../types/user.types";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await axiosInstance.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user profile:", error);
    throw error;
  }
};
