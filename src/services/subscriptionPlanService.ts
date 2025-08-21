import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { ISubscriptionPlan } from "../models/subscriptionPlan";

export const addSubscriptionPlan = async (
  subscriptionPlanData: {
    planName: string;
    monthlyPrice: number;
    commissionRate: number;
    WalletCreditDelay: number;
    profileBoost: string;
    durationInMonths: number;
    description: string;
  },
  role: string
) => {
  const apiRoute = getApiRoute(role);
  const response = await axiosInstance.post(
    `${apiRoute}/addsubscriptionplan`,
    subscriptionPlanData
  );
  return response.data;
};

export const getAllSubscriptionPlans = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: ISubscriptionPlan[];
  totalPages: number;
  currentPage: number;
  total: number;
  overview: {
    activeTechnicians: number;
    paidSubscribers: number;
    monthlyRevenue: number;
  };
}> => {
  try {
    console.log("fetching the subscription plans for the admin");

    let queryParams = "";

    if (
      page !== undefined &&
      page !== null &&
      limit !== undefined &&
      limit !== null
    ) {
      queryParams += `page=${page}&limit=${limit}`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&filterStatus=${encodeURIComponent(filterStatus)}`;
      }
    }

    const apiRoute = getApiRoute(role);

    const url = queryParams
      ? `${apiRoute}/subscriptionplans?${queryParams}`
      : `${apiRoute}/subscriptionplans`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.subscriptionPlans || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
      overview: response.data.data?.overview || {
        activeTechnicians: 0,
        paidSubscribers: 0,
        monthlyRevenue: 0,
      },
    };
  } catch (error) {
    console.log("Error occurred while fetching subscription plans:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
      overview: {
        activeTechnicians: 0,
        paidSubscribers: 0,
        monthlyRevenue: 0,
      },
    };
  }
};

export const toggleSubscriptionPlanStatus = async (
  subscriptionPlanId: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blocksubscriptionplan/${subscriptionPlanId}`
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
    price: number;
    commissionRate: number;
  },
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/updatesubscriptionplan/${subscriptionPlanId}`,
      subscriptionPlanData
    );
    return response.data;
  } catch (error) {
    console.log("Error occurred while updating the subscription plan:", error);
    throw error;
  }
};
