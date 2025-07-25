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
  CreateBookingRequest,
  BookServiceResponse,
} from "../types/user.types";
import { USER_API } from "../constants/apiRoutes";

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

export const getServiceDetails = async (serviceId: string) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/servicedetails/${serviceId}`
    );
    return response.data.data;
  } catch (error) {
    console.log("error occured while fetching the servicedetails:", error);
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

export const bookService = async (
  bookingData: CreateBookingRequest
): Promise<BookServiceResponse> => {
  try {
    const response = await axiosInstance.post(
      `${USER_API}/bookservice`,
      bookingData
    );
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const verifyPaymentSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get(
      `${USER_API}/verifypayment/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while verifypayment session:", error);
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

export const cancelBooking = async (
  bookingId: string,
  cancellationReason: string
) => {
  try {
    const response = await axiosInstance.put(
      `${USER_API}/cancelbooking/${bookingId}`,
      {
        cancellationReason,
      }
    );

    console.log("Cancel booking response:", response);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

export const rateService = async (
  bookingId: string,
  rating: number,
  review: string
) => {
  try {
    const response = await axiosInstance.post(
      `${USER_API}/rateservice/${bookingId}`,
      { rating, review }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while rating the service");
    throw error;
  }
};
