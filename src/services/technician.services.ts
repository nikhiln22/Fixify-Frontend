import axiosInstance from "../config/axios.config";
import { IWalletTransaction } from "../models/walletTransaction";
import {
  CreateTimeSlotsResponse,
  GetTimeSlotResponse,
  SubmitTechnicianQualificationResponse,
  TimeSlotData,
} from "../types/technicians.types";
import { TECHNICIAN_API } from "../constants/apiRoutes";

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<SubmitTechnicianQualificationResponse> => {
  try {
    const response =
      await axiosInstance.patch<SubmitTechnicianQualificationResponse>(
        `${TECHNICIAN_API}/qualifications`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error("Error submitting qualification:", error);
    throw error;
  }
};

export const createTimeSlots = async (
  timeSlotData: TimeSlotData
): Promise<CreateTimeSlotsResponse> => {
  try {
    const response = await axiosInstance.post<CreateTimeSlotsResponse>(
      `${TECHNICIAN_API}/addtimeslot`,
      timeSlotData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating time slots:", error);
    throw error;
  }
};

export const getTimeSlots = async (options?: {
  includePast: boolean;
}): Promise<GetTimeSlotResponse> => {
  const params: Record<string, string> = {};
  if (options?.includePast !== undefined) {
    params.includePast = options.includePast.toString();
  }
  try {
    const response = await axiosInstance.get<GetTimeSlotResponse>(
      `${TECHNICIAN_API}/timeslot`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};

export const blockTimeSlot = async (slotId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${TECHNICIAN_API}/blockslot/${slotId}`
    );
    return response.data;
  } catch (error) {
    console.log(
      "error occurred while blocking the technician time slot:",
      error
    );
    throw error;
  }
};

export const generateCompletionOtp = async (bookingId: string) => {
  try {
    const response = await axiosInstance.post(
      `${TECHNICIAN_API}/generatecompletionotp/${bookingId}`
    );
    return response;
  } catch (error) {
    console.log("error occured while genertaing the completion otp:", error);
    throw error;
  }
};

export const verifyCompletionOtp = async (bookingId: string, otp: string) => {
  try {
    const response = await axiosInstance.post(
      `${TECHNICIAN_API}/verifycompletionotp/${bookingId}`,
      { otp }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while veryfying the completion otp:", error);
    throw error;
  }
};

export const walletBalance = async () => {
  try {
    const response = await axiosInstance.get(`${TECHNICIAN_API}/walletbalance`);
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
    const url = `${TECHNICIAN_API}/wallettransactions?page=${page}&limit=6`;
    const response = await axiosInstance.get(url);
    console.log("response in the fetching wallet transactions api:", response);
    return {
      data: response.data.data?.transactions || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the wallet transactions:", error);
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
      `${TECHNICIAN_API}/cancelbooking/${bookingId}`,
      {
        cancellationReason,
      }
    );

    console.log("Cancel booking response:", response);
    return response.data;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
  }
};

export const getReviews = async () => {
  try {
    const response = await axiosInstance.get(`${TECHNICIAN_API}/reviews`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the reviews:", error);
    throw error;
  }
};

export const getActiveSubscriptionPlan = async () => {
  try {
    const response = await axiosInstance.get(`${TECHNICIAN_API}/subscription`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the active subscription:", error);
    throw error;
  }
};
