import axiosInstance from "../config/axios.config";
import { Icategory } from "../models/category";


export const getAllDesignations = async (
  page?: number,
  search?: string,
  role: "admin" | "technician" = "admin"
): Promise<any> => {
  try {
    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
    }
    
    const baseUrl =
      role === "admin"
        ? "/admin/jobdesignations"
        : "/technician/jobdesignations";
        
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    const response = await axiosInstance.get(url);
    
    if (role === "technician") {
      if (response.data && response.data.success && Array.isArray(response.data.designation)) {
        return response.data.designation;
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
  role: "admin" | "user" = "admin"
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

