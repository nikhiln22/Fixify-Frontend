import axiosInstance from "../config/axios.config";
import { Icategory } from "../models/category";
import { Idesignation } from "../models/designation";
import { Itechnician } from "../models/technician";
import { Iuser } from "../models/user";

export const getAllDesignations = async (
  page: number
): Promise<{
  data: Idesignation[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axiosInstance.get(
      `/admin/jobdesignations?page=${page}`
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
  designation: string
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
    `/admin/blockjobdesignation/${id}`
  );
  console.log("response from the toggledesignationstatus:", response.data);
  return response.data;
};

export const getAllUsers = async (
  page: number
): Promise<{
  data: Iuser[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axiosInstance.get(`/admin/userslist?page=${page}`);
    console.log("response:", response);
    return {
      data: response.data.users || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    console.error("error fetching the users:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
    };
  }
};

export const toggleUserStatus = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/blockuser/${userId}`);
    return response.data;
  } catch (error) {
    console.log("error toggling user status:", error);
    throw error;
  }
};

export const getAllApplicants = async (
  page: number
): Promise<{
  data: Itechnician[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axiosInstance.get(
      `/admin/applicantslist?page=${page}`
    );
    console.log("response:", response);
    return {
      data: response.data.applicants || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    console.error("error fetching the applicants:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
    };
  }
};

export const createCategory = async (formData: FormData) => {
  const response = await axiosInstance.post("/admin/addcategory", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllCategories = async (
  page: number
): Promise<{
  data: Icategory[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const response = await axiosInstance.get(`/admin/categories?page=${page}`);
    console.log("response:", response);
    return {
      data: response.data.categories || [],
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    console.error("error fetching the categories:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
    };
  }
};

export const toggleCategoryStatus = async (categoryId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/blockcategory/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  formData: FormData
) => {
  try {
    const response = await axiosInstance.put(
      `/admin/updatecategory/${categoryId}`,
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
