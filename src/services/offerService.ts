import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { IOffer } from "../models/offer";

export const addOffer = async (offerData: Partial<IOffer>, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/addoffer`,
      offerData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const updateOffer = async (
  offerId: string,
  offerData: Partial<IOffer>,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/updateoffer/${offerId}`,
      offerData
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while updating the added offer:", error);
    throw error;
  }
};

export const toggleOfferStatus = async (offerId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.patch(
      `${apiRoute}/blockoffer/${offerId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const getAllOffers = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: IOffer[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the offers for the ${role}`);

    let queryParams = "";

    if (
      page !== undefined &&
      page !== null &&
      limit !== null &&
      limit !== undefined
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
      ? `${apiRoute}/offers?${queryParams}`
      : `${apiRoute}/offers`;

    const response = await axiosInstance.get(url);

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
