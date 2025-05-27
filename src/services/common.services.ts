import axiosInstance from "../config/axios.config";
import { Icategory } from "../models/category";
import { Idesignation } from "../models/designation";
import { IService } from "../models/service";
import { Itechnician } from "../models/technician";
import { TechnicianProfileResponse } from "../types/technicians.types";


export const getAllDesignations = async (
  page?: number,
  search?: string,
  role: "admin" | "technician" = "admin",
  filterStatus?: string
): Promise<string[] | {
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
        response.data.data &&
        Array.isArray(response.data.data.designations)
      ) {
        const designationNames = response.data.data.designations.map(
          (item: any) => item.designation
        );
        return designationNames;
      }
      
      return [];
    }

    return {
      data: response.data.data.designations || [],
      totalPages: response.data.data.pagination?.pages || 1,
      currentPage: response.data.data.pagination?.page || page || 1,
      total: response.data.data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching designations:", error);

    if (role === "technician") {
      return [];
    }

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

export const getTechnicianProfile = async (
  role: "admin" | "technician" = "technician",
  technicianId?: string
): Promise<Itechnician> => {
  try {
    console.log(`fetching technician profile for ${role}`);
    
    let url: string;
    
    if (role === "technician") {
      url = "/technician/profile";
    } else if (role === "admin") {
      if (!technicianId) {
        throw new Error("Technician ID is required for admin access");
      }
      url = `/admin/technicianprofile/${technicianId}`;
    } else {
      throw new Error("Invalid role specified");
    }

    const response = await axiosInstance.get<TechnicianProfileResponse>(url);
    
    console.log(`technician profile response for ${role}:`, response);
    
    if (response.data.technician) {
      return response.data.technician;
    } else {
      throw new Error("Technician data not found in response");
    }
  } catch (error) {
    console.error(`Error fetching technician profile for ${role}:`, error);
    throw error;
  }
};
