import axiosInstance from "../config/axios.config";
import { Icategory } from "../models/category";
import { Idesignation } from "../models/designation";
import { IService } from "../models/service";


export const getAllDesignations = async (
  page?: number,
  search?: string,
  role: "admin" | "technician" = "admin",
  filterStatus?: string
): Promise<{
  data: Idesignation[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl =
      role === "admin"
        ? "/admin/jobdesignations"
        : "/technician/jobdesignations";

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    const response = await axiosInstance.get(url);

    if (role === "technician") {
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.designation)
      ) {
        return {
          data: response.data.designation,
          totalPages: 1,
          currentPage: 1,
          total: response.data.designation.length,
        };
      }
      
      return {
        data: [],
        totalPages: 0,
        currentPage: 1,
        total: 0,
      };
    }

    return {
      data: response.data.data.designations || [],
      totalPages: response.data.data.pagination?.pages || 1,
      currentPage: response.data.data.pagination?.page || page || 1,
      total: response.data.data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching designations:", error);

    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getAllCategories = async (
  page?: number,
  search?: string,
  role: "admin" | "user" = "admin",
  filterStatus?: string
): Promise<{
  data: Icategory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the categories for ${role}`);

    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl = role === "admin" ? "/admin/categories" : "/user/categories";

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

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

export const getAllServices = async (
  page?: number,
  search?: string,
  categoryId?: string,
  role: "admin" | "user" = "admin",
  filterStatus?: string
): Promise<{
  data: IService[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the services for ${role}`);
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (categoryId && categoryId.trim() !== "") {
        queryParams += `&category=${categoryId}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl = role === "admin" ? "/admin/services" : "/user/services";
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

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
