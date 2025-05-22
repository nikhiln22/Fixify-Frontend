import axiosInstance from "../config/axios.config";
import { Icategory } from "../models/category";
import { Idesignation } from "../models/designation";
import { IService } from "../models/service";
import { Itechnician } from "../models/technician";
import { Iuser } from "../models/user";

export const addJobDesignation = async (
  designation: string
): Promise<Idesignation> => {
  try {
    console.log("adding the job new job designation into the databse");
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
  page?: number,
  search?: string
): Promise<{
  data: Iuser[];
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
    }
    const url = queryParams
      ? `/admin/userslist?${queryParams}`
      : "/admin/userslist";
    const response = await axiosInstance.get(url);
    console.log("users response:", response);
    return {
      data: response.data.data?.users || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the users:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
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
  page?: number,
  search?: string
): Promise<{
  data: Icategory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the categories");
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
    }

    const url = queryParams
      ? `/admin/categories?${queryParams}`
      : "/admin/categories";

    const response = await axiosInstance.get(url);
    console.log("response:", response);
    return {
      data: response.data.data?.categories || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("error fetching the categories:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
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

export const createService = async (formData: FormData) => {
  const response = await axiosInstance.post("/admin/addservice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllServices = async (
  page?: number,
  search?: string,
  categoryId?: string
): Promise<{
  data: IService[];
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
      if (categoryId && categoryId.trim() !== "") {
        queryParams += `&category=${categoryId}`;
      }
    }

    const url = queryParams
      ? `/admin/services?${queryParams}`
      : "/admin/services";

    const response = await axiosInstance.get(url);
    console.log("services response:", response);

    return {
      data: response.data.data?.services || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the services:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const toggleServiceStatus = async (serviceId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/blockservice/${serviceId}`
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
      `/admin/updateservice/${serviceId}`,
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
