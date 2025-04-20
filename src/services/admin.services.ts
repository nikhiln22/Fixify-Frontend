import axiosInstance from "../config/axios.config";
import { Idesignation } from "../models/designation";

export const getAllDesignations = async (
  page: number,
): Promise<{
  data: Idesignation[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axiosInstance.get(
      `/admin/jobdesignations?page=${page}`,
    );
    console.log("Response:", response);
    return {
      data: response.data.designations || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    console.error("Error fetching designations:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
    };
  }
};

export const addJobDesignation = async (
  designation: string,
): Promise<Idesignation> => {
  try {
    const response = await axiosInstance.post("/admin/addjobdesignation", {
      designation,
    });
    return response.data.designation;
  } catch (error) {
    console.error("Error adding job designation:", error);
    throw error;
  }
};

export const toggleDesignationStatus = async (id: string) => {
  const response = await axiosInstance.patch(
    `/admin/blockjobdesignation/${id}`,
  );
  console.log("response from the toggledesignationstatus:",response.data);
  return response.data;
};
