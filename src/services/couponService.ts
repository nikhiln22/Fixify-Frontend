import axiosInstance from "../config/axios.config";
import { COUPONS_API } from "../constants/apiRoutes";
import { ICoupon } from "../models/coupon";

export const getAllCoupons = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: ICoupon[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log("fetching the offers for the admin");
    const baseUrl = `${COUPONS_API}/admin`;
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=${limit}`;

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
      `${COUPONS_API}/${couponId}/block`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const addCoupon = async (couponData: Partial<ICoupon>) => {
  try {
    const response = await axiosInstance.post(`${COUPONS_API}`, couponData);
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const updateCoupon = async (
  couponId: string,
  couponData: Partial<ICoupon>
) => {
  try {
    const response = await axiosInstance.put(
      `${COUPONS_API}/${couponId}`,
      couponData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while updating the added offer:", error);
    throw error;
  }
};

export const getEligibleCoupons = async (serviceId: string) => {
  try {
    const response = await axiosInstance.get(`${COUPONS_API}/eligible`, {
      params: {
        serviceId: serviceId,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error fetching while fetching the coupons:", error);
  }
};

export const applyCoupon = async (serviceId: string, couponId: string) => {
  try {
    const response = await axiosInstance.patch(`${COUPONS_API}/apply`, {
      serviceId,
      couponId,
    });
    return response.data;
  } catch (error) {
    console.log("error occured while applying the coupons:", error);
  }
};
