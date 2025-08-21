import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { Icategory } from "../models/category";

export const getAllCategories = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: Icategory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the categories for ${role}`);

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
    }

    const apiRoute = getApiRoute(role);
    const url = queryParams
      ? `${apiRoute}/categories?${queryParams}`
      : `${apiRoute}/categories`;

    const response = await axiosInstance.get(url);
    console.log("response:", response);

    return {
      data: response.data.data?.categories || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`error fetching the categories for ${role}:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const createCategory = async (formData: FormData, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/addcategory`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error occured while creating category:", error);
    throw error;
  }
};

export const toggleCategoryStatus = async (
  categoryId: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockcategory/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  formData: FormData,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/updatecategory/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
