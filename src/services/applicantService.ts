import axiosInstance from "../config/axios.config";
import { Itechnician } from "../models/technician";
import { APPLICANTS_API } from "../constants/apiRoutes";

export const getAllApplicants = async (
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
      ? `${APPLICANTS_API}?${queryParams}`
      : `${APPLICANTS_API}`;

    const response = await axiosInstance.get(url);

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

export const applicantDetails = async (applicantId: string) => {
  try {
    const response = await axiosInstance.get(
      `${APPLICANTS_API}/${applicantId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the applicant details", error);
    throw error;
  }
};

export const approveApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${APPLICANTS_API}/${applicantId}/approve`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while approving the applicants:", error);
    throw error;
  }
};

export const rejectApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${APPLICANTS_API}/${applicantId}/reject`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while rejecting the applicants:", error);
    throw error;
  }
};
