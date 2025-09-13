import axiosInstance from "../config/axios.config";
import { SubmitTechnicianQualificationResponse } from "../types/technicians.types";
import { TECHNICIAN_API } from "../constants/apiRoutes";
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
    console.log("✅ Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting qualification:", error);
    throw error;
  }
};

export const getAllTechnicians = async (
  page: number | null,
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

    const url = queryParams
      ? `${TECHNICIAN_API}?${queryParams}`
      : `${TECHNICIAN_API}`;

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

export const getTechnicianProfile = async (): Promise<Itechnician> => {
  try {
    console.log(`fetching technician profile`);

    const response = await axiosInstance.get(`${TECHNICIAN_API}/me`);

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching technician profile`, error);
    throw error;
  }
};

export const technicianDetails = async (technicianId: string) => {
  try {
    console.log("fetching the technician details");
    const response = await axiosInstance.get(
      `${TECHNICIAN_API}/${technicianId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the technician details:", error);
    throw error;
  }
};

export const toggleTechnicianStatus = async (technicianId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${TECHNICIAN_API}/${technicianId}/block`
    );
    return response.data;
  } catch (error) {
    console.log("error toggling technician status:", error);
    throw error;
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
