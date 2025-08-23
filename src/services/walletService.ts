import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { IWalletTransaction } from "../models/walletTransaction";

export const addMoney = async (role: string, amount: number) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(`${apiRoute}/addmoney`, {
      amount,
    });
    console.log("response in the add money to wallet api call:", response);
    return response.data;
  } catch (error) {
    console.log("error while adding the money to the wallet:", error);
    throw error;
  }
};

export const verifyWalletSession = async (role: string, sessionId: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(
      `${apiRoute}/verifywalletsession/${sessionId}`
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

export const walletBalance = async (role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(`${apiRoute}/walletbalance`);
    console.log("response in the wallet balance checking api", response);
    return response.data;
  } catch (error) {
    console.log("error occured while fetching the user balance:", error);
    throw error;
  }
};

export const getWalletTransactions = async (
  page: number | null,
  role: string,
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

    const apiRoute = getApiRoute(role);
    const url = queryParams
      ? `${apiRoute}/wallettransactions?${queryParams}`
      : `${apiRoute}/wallettransactions`;
    const response = await axiosInstance.get(url);
    console.log(
      `response in the fetching wallet transactions api for ${role}:`,
      response
    );
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
