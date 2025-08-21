import axiosInstance from "../config/axios.config";
import { IWalletTransaction } from "../models/walletTransaction";
import {
  CreateTimeSlotsResponse,
  GetTimeSlotResponse,
  SubmitTechnicianQualificationResponse,
  TimeSlotData,
} from "../types/technicians.types";
import { getApiRoute, TECHNICIAN_API } from "../constants/apiRoutes";
import { ISubscriptionPlanHistory } from "../models/subscriptionPlanHistory";
import { Itechnician } from "../models/technician";

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

export const getAllTechnicians = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null,
  filterDesignation?: string
): Promise<{
  data: Itechnician[];
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

      if (filterDesignation && filterDesignation.trim() !== "") {
        queryParams += `&designation=${encodeURIComponent(filterDesignation)}`;
      }
    }

    const apiRoute = getApiRoute(role);

    const url = queryParams
      ? `${apiRoute}/technicianslist?${queryParams}`
      : `${apiRoute}/technicianslist`;

    const response = await axiosInstance.get(url);
    console.log("technicians response:", response);

    return {
      data: response.data.data?.technicians || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the technicians:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getTechnicianProfile = async (
  role: string,
  technicianId?: string
): Promise<Itechnician> => {
  try {
    console.log(`fetching technician profile for ${role}`);

    const apiRoute = getApiRoute(role);

    const url =
      role === "technician"
        ? `${apiRoute}/technicianprofile`
        : `${apiRoute}/technicianprofile/${technicianId}`;

    const response = await axiosInstance.get(url);

    console.log(`technician profile response for ${role}:`, response);

    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Technician data not found in response");
    }
  } catch (error) {
    console.error(`Error fetching technician profile for ${role}:`, error);
    throw error;
  }
};

export const toggleTechnicianStatus = async (
  technicianId: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blocktechnician/${technicianId}`
    );
    return response.data;
  } catch (error) {
    console.log("error toggling technician status:", error);
    throw error;
  }
};

export const getAllPendingTechnicians = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null,
  filterDesignation?: string
): Promise<{
  data: Itechnician[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    const apiRoute = getApiRoute(role);

    let queryParams = "";

    if (
      page !== null &&
      page !== undefined &&
      limit !== null &&
      limit !== undefined
    ) {
      queryParams = `page=${page}&limit=${limit}`;
    }

    if (search?.trim()) {
      queryParams += queryParams
        ? `&search=${encodeURIComponent(search)}`
        : `search=${encodeURIComponent(search)}`;
    }

    if (filterStatus?.trim()) {
      queryParams += queryParams
        ? `&status=${encodeURIComponent(filterStatus)}`
        : `status=${encodeURIComponent(filterStatus)}`;
    }

    if (filterDesignation?.trim()) {
      queryParams += queryParams
        ? `&designation=${encodeURIComponent(filterDesignation)}`
        : `designation=${encodeURIComponent(filterDesignation)}`;
    }

    const url = queryParams
      ? `${apiRoute}/applicantslist?${queryParams}`
      : `${apiRoute}/applicantslist`;

    const response = await axiosInstance.get(url);
    console.log("applicants response:", response);

    return {
      data: response.data.data?.applicants || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
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

export const approveTechnicians = async (applicantId: string, role: string) => {
  try {
    let apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/verifyapplicant/${applicantId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while verifying the technician:", error);
    throw error;
  }
};

export const rejectTechnician = async (applicantId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.delete(
      `${apiRoute}/rejectapplicant/${applicantId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while rejecting the technician:", error);
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

export const getSubscriptionHistory = async (
  page?: number
): Promise<{
  data: ISubscriptionPlanHistory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    const url = `${TECHNICIAN_API}/subscriptionhistory?page=${page}&limit=6`;
    const response = await axiosInstance.get(url);
    console.log(
      "response in the fetching subscription history for technician:",
      response
    );
    return {
      data: response.data.data?.subscriptionPlanHistory || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the subscription history:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getAllSubscriptionPlans = async () => {
  try {
    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/subscriptionplans`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the subscription plans:", error);
    throw error;
  }
};

export const purchaseSubscription = async (planId: string) => {
  try {
    const response = await axiosInstance.post(
      `${TECHNICIAN_API}/purchaseplan`,
      { planId }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while purchasing the plan:", error);
    throw error;
  }
};

export const verifyPurchase = async (sessionId: string) => {
  try {
    const response = await axiosInstance.post(
      `${TECHNICIAN_API}/verifypurchase/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while verifying the purchase");
    throw error;
  }
};

export const getTechnicianDashBoardStats = async () => {
  try {
    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/dashboardstats`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the technician dashboard stats");
    throw error;
  }
};

export const getTechnicianEarnings = async (
  period: "daily" | "weekly" | "monthly" | "yearly" = "daily"
) => {
  try {
    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/technicianearnings?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while fetching the technician earnings");
    throw error;
  }
};

export const getTechnicianServiceCategories = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/servicecategoryrevenue?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(
      "error occurred while fetching the technician service categories"
    );
    throw error;
  }
};

export const getTechnicianBookingStatus = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/bookingstatusdistribution?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while fetching the technician booking status");
    throw error;
  }
};
