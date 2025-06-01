import axiosInstance from "../config/axios.config";
import { Iuser } from "../models/user";
import {
  UserProfileResponse,
  AddAddressData,
  AddAddressResponse,
  UpdateAddressResponse,
  DeleteAddressResponse,
  getAddressResponse
} from "../types/user.types";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await axiosInstance.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user profile:", error);
    throw error;
  }
};

export const editProfile = async (formData: FormData): Promise<Iuser> => {
  try {
    const response = await axiosInstance.put(
      "/api/user/updateprofile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.user;
  } catch (error) {
    console.log("error occurred while updating the user profile:", error);
    throw error;
  }
};

export const addAddress = async (
  addressData: Partial<AddAddressData>
): Promise<AddAddressResponse> => {
  try {
    const response = await axiosInstance.post("/api/user/address", addressData);
    return response.data;
  } catch (error) {
    console.log("error occurred while adding address:", error);
    throw error;
  }
};

export const getUserAddresses = async (): Promise<getAddressResponse> => {
  try {
    const response = await axiosInstance.get("/api/user/address");
    return response.data;
  } catch (error) {
    console.log("error occurred while fetching addresses:", error);
    throw error;
  }
};

export const updateAddress = async (
  addressId: string,
  addressData: Partial<AddAddressData>
): Promise<UpdateAddressResponse> => {
  try {
    const response = await axiosInstance.put(
      `/api/user/updateaddress/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while updating address:", error);
    throw error;
  }
};

export const deleteAddress = async (
  addressId: string
): Promise<DeleteAddressResponse> => {
  try {
    const response = await axiosInstance.delete(
      `/api/user/deleteaddress/${addressId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while deleting address:", error);
    throw error;
  }
};
