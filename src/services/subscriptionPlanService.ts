import axiosInstance from "../config/axios.config";
import { SUBSCRIPTION_PLANS_API } from "../constants/apiRoutes";
import { ISubscriptionPlan } from "../models/subscriptionPlan";
import { ISubscriptionPlanHistory } from "../models/subscriptionPlanHistory";

export const addSubscriptionPlan = async (subscriptionPlanData: {
  planName: string;
  monthlyPrice: number;
  commissionRate: number;
  WalletCreditDelay: number;
  profileBoost: string;
  durationInMonths: number;
  description: string;
}) => {
  const response = await axiosInstance.post(
    `${SUBSCRIPTION_PLANS_API}`,
    subscriptionPlanData
  );
  return response.data;
};

export const getAllSubscriptionPlans = async (
  page: number | null,
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
    console.log("fetching the subscription plans");

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

    const url = queryParams
      ? `${SUBSCRIPTION_PLANS_API}/?${queryParams}`
      : `${SUBSCRIPTION_PLANS_API}`;

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
  subscriptionPlanId: string
) => {
  try {
    const response = await axiosInstance.patch(
      `${SUBSCRIPTION_PLANS_API}/${subscriptionPlanId}/block`
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
  }
) => {
  try {
    const response = await axiosInstance.put(
      `${SUBSCRIPTION_PLANS_API}/${subscriptionPlanId}`,
      subscriptionPlanData
    );
    return response.data;
  } catch (error) {
    console.log("Error occurred while updating the subscription plan:", error);
    throw error;
  }
};

export const getAllSubscriptionPlansHistory = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: ISubscriptionPlanHistory[];
  totalPages: number;
  currentPage: number;
  total: number;
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

    const url = queryParams
      ? `${SUBSCRIPTION_PLANS_API}/history?${queryParams}`
      : `${SUBSCRIPTION_PLANS_API}/history`;

    const response = await axiosInstance.get(url);
    console.log(
      "response in the fetchning all the subscription plans history:",
      response
    );
    return {
      data: response.data.data?.subscriptionPlanHistory || [],
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

export const purchaseSubscription = async (planId: string) => {
  try {
    const response = await axiosInstance.post(
      `${SUBSCRIPTION_PLANS_API}/purchase`,
      { planId }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while purchasing the plan:", error);
    throw error;
  }
};

export const verifyPurchase = async (sessionId: string) => {
  try {
    const response = await axiosInstance.post(
      `${SUBSCRIPTION_PLANS_API}/${sessionId}/verify-payment`
    );
    return response.data;
  } catch (error) {
    console.log("error occurred while verifying the purchase");
    throw error;
  }
};

export const getTechnicianActiveSubscriptionPlan = async () => {
  try {
    const response = await axiosInstance.get(
      `${SUBSCRIPTION_PLANS_API}/active`
    );
    return response.data;
  } catch (error) {
    console.log(
      "error occured while fetching the active subscription plan:",
      error
    );
    throw error;
  }
};
