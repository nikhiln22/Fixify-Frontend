import axiosInstance from "../config/axios.config";
import { Itechnician } from "../models/technician";
import { Iuser } from "../models/user";
import { UserProfileResponse } from "../types/user.types";
import { USER_API } from "../constants/apiRoutes";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    console.log("fetching the profile of the user in user service:");
    const response = await axiosInstance.get(`${USER_API}/me`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user profile:", error);
    throw error;
  }
};

export const editProfile = async (formData: FormData): Promise<Iuser> => {
  try {
    const response = await axiosInstance.put(`${USER_API}/me`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.user;
  } catch (error) {
    console.log("error occurred while updating the user profile:", error);
    throw error;
  }
};

export const getNearbyTechnicians = async (
  designationId: string,
  latitude: number,
  longitude: number,
  radius: number = 10
): Promise<Itechnician[]> => {
  try {
    const response = await axiosInstance.get(`${USER_API}/technicians`, {
      params: {
        designationId,
        latitude,
        longitude,
        radius,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching nearby technicians:", error);
    return [];
  }
};

export const getAllUsers = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: Iuser[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    let queryParams = "";
    if (
      page !== undefined &&
      page !== null &&
      limit !== null &&
      limit !== undefined
    ) {
      queryParams += `page=${page}&limit=${limit}`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }
    const url = queryParams ? `${USER_API}/?${queryParams}` : `${USER_API}`;
    const response = await axiosInstance.get(url);
    console.log("users response:", response);
    return {
      data: response.data.data?.users,
      totalPages: response.data.data?.pagination?.pages,
      currentPage: response.data.data?.pagination?.page,
      total: response.data.data?.pagination?.total,
    };
  } catch (error) {
    console.error("Error fetching the users:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const toggleUserStatus = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`${USER_API}/${userId}/block`);
    return response.data;
  } catch (error) {
    console.log("error toggling user status:", error);
    throw error;
  }
};
