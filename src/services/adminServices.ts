import axiosInstance from "../config/axios.config";
import { ADMIN_API } from "../constants/apiRoutes";

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
