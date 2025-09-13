import axiosInstance from "../config/axios.config";
import { ADDRESSES_API } from "../constants/apiRoutes";
import {
  AddAddressData,
  AddAddressResponse,
  DeleteAddressResponse,
  getAddressResponse,
  UpdateAddressResponse,
} from "../types/user.types";

export const addAddress = async (
  addressData: Partial<AddAddressData>
): Promise<AddAddressResponse> => {
  try {
    const response = await axiosInstance.post(`${ADDRESSES_API}`, addressData);
    return response.data;
  } catch (error) {
    console.log("error occurred while adding address:", error);
    throw error;
  }
};

export const getAddresses = async (): Promise<getAddressResponse> => {
  try {
    const response = await axiosInstance.get(`${ADDRESSES_API}`);
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
      `${ADDRESSES_API}/updateaddress/${addressId}`,
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
      `${ADDRESSES_API}/${addressId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while deleting address:", error);
    throw error;
  }
};
