import axiosInstance from "../config/axios.config";
import { Itechnician } from "../models/technician";
import { Iuser } from "../models/user";
import { IWalletTransaction } from "../models/walletTransaction";
import { GetTimeSlotResponse } from "../types/technicians.types";
import {
  UserProfileResponse,
  AddAddressData,
  AddAddressResponse,
  UpdateAddressResponse,
  DeleteAddressResponse,
  getAddressResponse,
} from "../types/user.types";
import { getApiRoute, USER_API } from "../constants/apiRoutes";

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    console.log("fetching the profile of the user in user service:");
    const response = await axiosInstance.get(`${USER_API}/profile`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user profile:", error);
    throw error;
  }
};

export const editProfile = async (formData: FormData): Promise<Iuser> => {
  try {
    const response = await axiosInstance.put(
      `${USER_API}/updateprofile`,
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
    const response = await axiosInstance.post(
      `${USER_API}/addaddress`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while adding address:", error);
    throw error;
  }
};

export const getUserAddresses = async (): Promise<getAddressResponse> => {
  try {
    const response = await axiosInstance.get(`${USER_API}/address`);
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
      `${USER_API}/updateaddress/${addressId}`,
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
      `${USER_API}/deleteaddress/${addressId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while deleting address:", error);
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

export const getTimeSlots = async (
  technicinaId: string,
  includePast: boolean
): Promise<GetTimeSlotResponse> => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/timeslots/${technicinaId}`,
      {
        params: {
          includePast: includePast,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error occured while fetching the time slots:", error);
    throw error;
  }
};

export const addMoney = async (amount: number) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/addmoney`, {
      amount,
    });
    console.log("response in the add money to wallet api call:", response);
    return response.data;
  } catch (error) {
    console.log("error while adding the money to the wallet:", error);
    throw error;
  }
};

export const verifyWalletSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/verifywalletsession/${sessionId}`
    );
    console.log("response in the verifyWalletSession api call:", response);
    return response.data;
  } catch (error) {
    console.log(
      "error occured while veryfying the wallet stripe session:",
      error
    );
  }
};

export const walletBalance = async () => {
  try {
    const response = await axiosInstance.get(`${USER_API}/walletbalance`);
    console.log("response in the wallet balance checking api", response);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user balance:", error);
    throw error;
  }
};

export const getWalletTransactions = async (
  page?: number
): Promise<{
  data: IWalletTransaction[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    const url = `${USER_API}/wallettransactions?page=${page}&limit=6`;
    const response = await axiosInstance.get(url);
    console.log("response in the fetching wallet transactions api:", response);
    return {
      data: response.data.data?.transactions || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the applicants:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getAllOffers = async () => {
  try {
    const response = await axiosInstance.get(`${USER_API}/offers`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching all the offers:", error);
  }
};

export const applyBestOffer = async (
  serviceId: string,
  totalAmount: number
) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/applybestoffer`, {
      serviceId,
      totalAmount,
    });
    return response.data;
  } catch (error) {
    console.log("error occured while applying the best offer:", error);
  }
};

export const getEligibleCoupons = async (serviceId: string) => {
  try {
    const response = await axiosInstance.get(`${USER_API}/coupons`, {
      params: {
        serviceId: serviceId,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error fetching while fetching the coupons:", error);
  }
};

export const applyCoupon = async (serviceId: string, couponId: string) => {
  try {
    const response = await axiosInstance.post(`${USER_API}/applycoupon`, {
      serviceId,
      couponId,
    });
    return response.data;
  } catch (error) {
    console.log("error occured while applying the coupons:", error);
  }
};

export const getAllUsers = async (
  page: number | null,
  role: string,
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
    let apiRoute = getApiRoute(role);
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
    const url = queryParams
      ? `${apiRoute}/userslist?${queryParams}`
      : `${apiRoute}/userslist`;
    const response = await axiosInstance.get(url);
    console.log("users response:", response);
    return {
      data: response.data.data?.users || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
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

export const toggleUserStatus = async (userId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockuser/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("error toggling user status:", error);
    throw error;
  }
};
