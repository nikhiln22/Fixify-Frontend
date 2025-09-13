import axiosInstance from "../config/axios.config";
import { OFFERS_API } from "../constants/apiRoutes";
import { IOffer } from "../models/offer";

export const addOffer = async (offerData: Partial<IOffer>) => {
  try {
    const response = await axiosInstance.post(`${OFFERS_API}`, offerData);
    return response.data;
  } catch (error) {
    console.log("Error occured while adding the new offer:", error);
    throw error;
  }
};

export const updateOffer = async (
  offerId: string,
  offerData: Partial<IOffer>
) => {
  try {
    const response = await axiosInstance.put(
      `${OFFERS_API}/${offerId}`,
      offerData
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
      `${OFFERS_API}/${offerId}/block`
    );
    return response.data;
  } catch (error) {
    console.log("Error occured while blocking the coupon:", error);
    throw error;
  }
};

export const getAllOffers = async (
  page: number | null,
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

    const url = queryParams
      ? `${OFFERS_API}/admin?${queryParams}`
      : `${OFFERS_API}/admin`;

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

export const getUserOffers = async () => {
  try {
    const response = await axiosInstance.get(`${OFFERS_API}`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching all the offers:", error);
  }
};

export const applyBestOffer = async (
  serviceId: string,
  totalAmount: number
) => {
  try {
    const response = await axiosInstance.post(`${OFFERS_API}/apply-best`, {
      serviceId,
      totalAmount,
    });
    return response.data;
  } catch (error) {
    console.log("error occured while applying the best offer:", error);
  }
};
