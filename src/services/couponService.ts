import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { ICoupon } from "../models/coupon";

export const getAllCoupons = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string
): Promise<{
  data: ICoupon[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the offers for the admin");
    const apiRole = getApiRoute(role);
    const baseUrl = `${apiRole}/coupons`;
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

export const toggleCouponStatus = async (couponId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockcoupon/${couponId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const addCoupon = async (couponData: Partial<ICoupon>, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/addcoupon`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const updateCoupon = async (
  couponId: string,
  couponData: Partial<ICoupon>,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/updatecoupon/${couponId}`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while updating the added offer:", error);
    throw error;
  }
};
