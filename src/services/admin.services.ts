import axiosInstance from "../config/axios.config";
import { ICoupon } from "../models/coupon";
import { Idesignation } from "../models/designation";
import { IOffer } from "../models/offer";
import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { Itechnician } from "../models/technician";
import { Iuser } from "../models/user";

export const addJobDesignation = async (
  designation: string
): Promise<Idesignation> => {
  try {
    console.log("adding the job new job designation into the databse");
    const response = await axiosInstance.post("/api/admin/addjobdesignation", {
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
    `/api/admin/blockjobdesignation/${id}`
  );
  console.log("response from the toggledesignationstatus:", response.data);
  return response.data;
};

export const getAllUsers = async (
  page?: number,
  search?: string,
  filterStatus?: string
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

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }
    const url = queryParams
      ? `/api/admin/userslist?${queryParams}`
      : "/api/admin/userslist";
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
    const response = await axiosInstance.patch(
      `/api/admin/blockuser/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("error toggling user status:", error);
    throw error;
  }
};

export const getAllTechnicians = async (
  page?: number,
  search?: string,
  filterStatus?: string,
  filterDesignation?: string
): Promise<{
  data: Itechnician[];
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

      if (filterDesignation && filterDesignation.trim() !== "") {
        queryParams += `&designation=${encodeURIComponent(filterDesignation)}`;
      }
    }

    const url = queryParams
      ? `/api/admin/technicianslist?${queryParams}`
      : "/api/admin/technicianslist";

    const response = await axiosInstance.get(url);
    console.log("technicians response:", response);

    return {
      data: response.data.data?.technicians || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the technicians:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const toggleTechnicianStatus = async (technicianId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blocktechnician/${technicianId}`
    );
    return response.data;
  } catch (error) {
    console.log("error toggling technician status:", error);
    throw error;
  }
};

export const getAllApplicants = async (
  page: number = 1
): Promise<{
  data: Itechnician[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    const url = `/api/admin/applicantslist?page=${page}&limit=6`;
    const response = await axiosInstance.get(url);
    console.log("applicants response:", response);

    return {
      data: response.data.data?.applicants || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the applicants:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      total: 0,
    };
  }
};

export const verifyApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/verifyapplicant/${applicantId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while verifying the technician:", error);
    throw error;
  }
};

export const rejectApplicant = async (applicantId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/rejectapplicant/${applicantId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while rejecting the technician:", error);
    throw error;
  }
};

export const createCategory = async (formData: FormData) => {
  const response = await axiosInstance.post(
    "/api/admin/addcategory",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const toggleCategoryStatus = async (categoryId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blockcategory/${categoryId}`
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
      `/api/admin/updatecategory/${categoryId}`,
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
  const response = await axiosInstance.post("/api/admin/addservice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const toggleServiceStatus = async (serviceId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blockservice/${serviceId}`
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
      `/api/admin/updateservice/${serviceId}`,
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

export const addOffer = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/api/admin/addoffer", formData);
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const getAllOffers = async (
  page?: number,
  search?: string,
  // userType?: string,
  filterStatus?: string
): Promise<{
  data: IOffer[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the offers for the admin");

    const baseUrl = "/api/admin/offers";
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&filterStatus=${encodeURIComponent(filterStatus)}`;
      }
    }

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log("response in the fetchning all the offers:", response);
    return {
      data: response.data.data?.offers || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.log("Error occurred while fetching offers:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const updateOffer = async (offerId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/updateoffer/${offerId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while updating the added offer:", error);
    throw error;
  }
};

export const toggleOfferStatus = async (offerId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blockoffer/${offerId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const getAllCoupons = async (
  page?: number,
  search?: string,
  // userType?: string,
  filterStatus?: string
): Promise<{
  data: ICoupon[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the offers for the admin");

    const baseUrl = "/api/admin/coupons";
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&filterStatus=${encodeURIComponent(filterStatus)}`;
      }
    }

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log("response in the fetchning all the coupons:", response);
    return {
      data: response.data.data?.offers || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.log("Error occurred while fetching coupons:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const toggleCouponStatus = async (couponId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blockcoupon/${couponId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const addCoupon = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/api/admin/addcoupon", formData);
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const updateCoupon = async (couponId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/updatecoupon/${couponId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while updating the added offer:", error);
    throw error;
  }
};

export const addSubscriptionPlan = async (subscriptionPlanData: {
  planName: string;
  monthlyPrice: number;
  commissionRate: number;
}) => {
  const response = await axiosInstance.post(
    "/api/admin/addsubscriptionplan",
    subscriptionPlanData
  );
  return response.data;
};

export const getAllSubscriptionPlans = async (
  page?: number,
  search?: string,
  filterStatus?: string
): Promise<{
  data: ISubscriptionPlan[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the subscription plans for the admin");

    const baseUrl = "/api/admin/subscriptionplans";
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&filterStatus=${encodeURIComponent(filterStatus)}`;
      }
    }

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log(
      "response in the fetchning all the subscription plans:",
      response
    );
    return {
      data: response.data.data?.subscriptionPlans || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.log("Error occurred while fetching subscription plans:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const toggleSubscriptionPlanStatus = async (
  subscriptionPlanId: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/blocksubscriptionplan/${subscriptionPlanId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the subscription plan:", error);
    throw error;
  }
};

export const updateSubscriptionPlan = async (
  subscriptionPlanId: string,
  subscriptionPlanData: {
    planName: string;
    monthlyPrice: number;
    commissionRate: number;
  }
) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/updatesubscriptionplan/${subscriptionPlanId}`,
      subscriptionPlanData
    );
    return response.data;
  } catch (error) {
    console.log("Error occurred while updating the subscription plan:", error);
    throw error;
  }
};
