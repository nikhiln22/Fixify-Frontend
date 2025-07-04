import axiosInstance from "../config/axios.config";
import { IWalletTransaction } from "../models/walletTransaction";
import {
  CreateTimeSlotsResponse,
  GetTimeSlotResponse,
  SubmitTechnicianQualificationResponse,
  TimeSlotData,
} from "../types/technicians.types";

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<SubmitTechnicianQualificationResponse> => {
  try {
    const response =
      await axiosInstance.patch<SubmitTechnicianQualificationResponse>(
        "/api/technician/qualifications",
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
      "/api/technician/addtimeslot",
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
      "/api/technician/timeslot",
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
      `/api/technician/blockslot/${slotId}`
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
      `/api/technician/generatecompletionotp/${bookingId}`
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
      `/api/technician/verifycompletionotp/${bookingId}`,
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
    const response = await axiosInstance.get("/api/technician/walletbalance");
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
    const url = `/api/technician/wallettransactions?page=${page}&limit=6`;
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
      `/api/technician/cancelbooking/${bookingId}`,
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
    const response = await axiosInstance.get("/api/technician/reviews");
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the reviews:", error);
    throw error;
  }
};
