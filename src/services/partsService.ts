import axiosInstance from "../config/axios.config";
import { PARTS_API } from "../constants/apiRoutes";
import { IPart } from "../models/parts";
import { AddPart } from "../types/part.types";

export const addPart = async (addPartData: AddPart) => {
  try {
    const response = await axiosInstance.post(`${PARTS_API}`, addPartData);
    return response.data;
  } catch (error) {
    console.error("Error adding part:", error);
    throw new Error("Failed to add part");
  }
};

export const getAllParts = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null,
  serviceId?: string
): Promise<{
  data: IPart[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the parts`);

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

      if (serviceId && serviceId.trim() !== "") {
        queryParams += `&serviceId=${serviceId}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const url = queryParams ? `${PARTS_API}?${queryParams}` : `${PARTS_API}`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.parts || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`Error fetching the services`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const togglePartStatus = async (partId: string) => {
  try {
    const response = await axiosInstance.patch(`${PARTS_API}/${partId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const updatePart = async (partId: string, formData: AddPart) => {
  try {
    const response = await axiosInstance.put(
      `${PARTS_API}/${partId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating parts:", error);
    throw error;
  }
};
