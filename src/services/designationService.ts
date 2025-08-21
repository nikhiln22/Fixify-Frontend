import axiosInstance from "../config/axios.config";
import { Idesignation } from "../models/designation";
import { getApiRoute } from "../constants/apiRoutes";

export const getAllDesignations = async (
  page: number | null,
  role: string,
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

    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(
      `${apiRoute}/jobdesignations?${queryParams}`
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
  designation: string,
  role: string
): Promise<Idesignation> => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(`${apiRoute}/addjobdesignation`, {
      designation,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error adding job designation:", error);
    throw error;
  }
};

export const toggleDesignationStatus = async (id: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockjobdesignation/${id}`
    );
    console.log("response from the toggledesignationstatus:", response.data);
    return response.data;
  } catch (error) {
    console.log("error occured while toggling the designation status:", error);
  }
};
