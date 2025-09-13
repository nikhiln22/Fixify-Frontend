import axiosInstance from "../config/axios.config";
import { Idesignation } from "../models/designation";
import { DESIGNATIONS_API } from "../constants/apiRoutes";

export const getAllDesignations = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: Idesignation[];
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
      queryParams += `&search=${encodeURIComponent(search)}`;
    }
    if (filterStatus?.trim()) {
      queryParams += `&status=${encodeURIComponent(filterStatus)}`;
    }

    const response = await axiosInstance.get(
      `${DESIGNATIONS_API}?${queryParams}`
    );

    return {
      data: response.data.data.designations || [],
      totalPages: response.data.data.pagination?.pages || 1,
      currentPage: response.data.data.pagination?.page || page,
      total: response.data.data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching designations for admin:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const addJobDesignation = async (
  designation: string
): Promise<Idesignation> => {
  try {
    const response = await axiosInstance.post(`${DESIGNATIONS_API}`, {
      designation,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error adding job designation:", error);
    throw error;
  }
};

export const toggleDesignationStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      `${DESIGNATIONS_API}/${id}/status`
    );
    console.log("response from the toggledesignationstatus:", response.data);
    return response.data;
  } catch (error) {
    console.log("error occured while toggling the designation status:", error);
  }
};
