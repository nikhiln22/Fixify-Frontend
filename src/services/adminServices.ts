import axiosInstance from "../config/axios.config";
import { ADMIN_API } from "../constants/apiRoutes";
import { ISubscriptionPlanHistory } from "../models/subscriptionPlanHistory";

export const getAllSubscriptionPlansHistory = async (
  page?: number,
  search?: string,
  filterStatus?: string
): Promise<{
  data: ISubscriptionPlanHistory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the subscription plans for the admin");

    const baseUrl = `${ADMIN_API}/subscriptionhistory`;
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

export const technicianReviews = async (technicianId: string) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/technicianreviews`, {
      params: {
        technicianId,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error occurred while fetching the technician reviews:", error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/dashboardstats`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the dashboard stats:", error);
    throw error;
  }
};

export const getBookingStatusDistribution = async () => {
  try {
    const response = await axiosInstance.get(`${ADMIN_API}/bookingsstats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRevenueTrends = async (days: number = 30) => {
  try {
    const response = await axiosInstance.get(
      `${ADMIN_API}/revenuetrends?days=${days}`
    );
    return response.data;
  } catch (error) {}
};

export const getServiceCategoryPerformance = async (
  limit: number = 10,
  days: number = 30
) => {
  try {
    const response = await axiosInstance.get(
      `${ADMIN_API}/servicecategoryperformance?limit=${limit}&days=${days}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

