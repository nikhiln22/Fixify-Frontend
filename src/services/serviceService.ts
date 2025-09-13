import axiosInstance from "../config/axios.config";
import { SERVICES_API } from "../constants/apiRoutes";
import { IService } from "../models/service";

export const getAllServices = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null,
  categoryId?: string,
  serviceType?: string
): Promise<{
  data: IService[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the service`);

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

      if (serviceType && serviceType !== "all" && serviceType.trim() !== "") {
        queryParams += `&serviceType=${encodeURIComponent(serviceType)}`;
      }
    }

    const url = queryParams
      ? `${SERVICES_API}?${queryParams}`
      : `${SERVICES_API}`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.services || [],
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

export const createService = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`${SERVICES_API}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("error occured while creating the service:", error);
    throw error;
  }
};

export const toggleServiceStatus = async (serviceId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${SERVICES_API}/${serviceId}/status`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const updateService = async (serviceId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `${SERVICES_API}/${serviceId}`,
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

export const getServiceDetails = async (serviceId: string) => {
  try {
    const response = await axiosInstance.get(`${SERVICES_API}/${serviceId}`);
    return response.data.data;
  } catch (error) {
    console.log("error occured while fetching the servicedetails:", error);
    throw error;
  }
};

export const getMostBookedServices = async () => {
  try {
    const response = await axiosInstance.get(`${SERVICES_API}/most-booked`, {
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
