import axiosInstance from "../config/axios.config";
import { WALLET_API } from "../constants/apiRoutes";
import { IWalletTransaction } from "../models/walletTransaction";

export const addMoney = async (amount: number) => {
  try {
    const response = await axiosInstance.post(`${WALLET_API}/add-money`, {
      amount,
    });
    console.log("response in the add money to wallet api call:", response);
    return response.data;
  } catch (error) {
    console.log("error while adding the money to the wallet:", error);
    throw error;
  }
};

export const verifyWalletSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get(
      `${WALLET_API}/${sessionId}/verify-payment`
    );
    console.log("response in the verifyWalletSession api call:", response);
    return response.data;
  } catch (error) {
    console.log(
      "error occured while veryfying the wallet stripe session:",
      error
    );
  }
};

export const walletBalance = async () => {
  try {
    const response = await axiosInstance.get(`${WALLET_API}/balance`);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user balance:", error);
    throw error;
  }
};

export const getWalletTransactions = async (
  page: number | null,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: IWalletTransaction[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
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
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const url = queryParams
      ? `${WALLET_API}/transactions?${queryParams}`
      : `${WALLET_API}/transactions`;
    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.transactions || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching the applicants:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};
