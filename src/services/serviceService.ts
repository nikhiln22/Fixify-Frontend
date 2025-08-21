import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { IService } from "../models/service";

export const getAllServices = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null,
  categoryId?: string
): Promise<{
  data: IService[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the services for ${role}`);

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

      if (categoryId && categoryId.trim() !== "") {
        queryParams += `&categoryId=${categoryId}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const apiRoute = getApiRoute(role);
    const url = queryParams
      ? `${apiRoute}/services?${queryParams}`
      : `${apiRoute}/services`;

    const response = await axiosInstance.get(url);
    console.log(`services response for ${role}:`, response);

    return {
      data: response.data.data?.services || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`Error fetching the services for ${role}:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const createService = async (formData: FormData, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/addservice`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while creating the service:", error);
    throw error;
  }
};

export const toggleServiceStatus = async (serviceId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockservice/${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const updateService = async (
  serviceId: string,
  formData: FormData,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/updateservice/${serviceId}`,
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

export const getServiceDetails = async (serviceId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(
      `${apiRoute}/servicedetails/${serviceId}`
    );
    return response.data.data;
  } catch (error) {
    console.log("error occured while fetching the servicedetails:", error);
    throw error;
  }
};

export const getMostBookedServices = async (role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(`${apiRoute}/mostbooked`, {
      params: {
        limit: 6,
        days: 30,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching most booked services:", error);
    throw error;
  }
};
