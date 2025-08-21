import axiosInstance from "../config/axios.config";
import { getApiRoute } from "../constants/apiRoutes";
import { IBooking } from "../models/booking";
import {
  BookingDetailsResponse,
  BookServiceResponse,
  CreateBookingRequest,
} from "../types/user.types";

export const bookService = async (
  bookingData: CreateBookingRequest,
  role: string
): Promise<BookServiceResponse> => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/bookservice`,
      bookingData
    );
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const verifyPaymentSession = async (sessionId: string, role: string) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(
      `${apiRoute}/verifypayment/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while verifypayment session:", error);
    throw error;
  }
};

export const createBookingRating = async (
  bookingId: string,
  rating: number,
  review: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.post(
      `${apiRoute}/rateservice/${bookingId}`,
      { rating, review }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while rating the service");
    throw error;
  }
};

export const cancelBooking = async (
  bookingId: string,
  cancellationReason: string,
  role: string
) => {
  try {
    const apiRoute = getApiRoute(role);
    const response = await axiosInstance.put(
      `${apiRoute}/cancelbooking/${bookingId}`,
      {
        cancellationReason,
      }
    );

    console.log("Cancel booking response:", response);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

export const getBookings = async (
  page: number | null,
  role: string,
  search?: string,
  filterStatus?: string,
  limit?: number | null
): Promise<{
  data: IBooking[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the bookings for ${role}`);

    let queryParams = "";
    if (page !== null && limit !== null) {
      queryParams += `page=${page}&limit=${limit}`;
    }

    if (search?.trim()) {
      queryParams += `&search=${encodeURIComponent(search)}`;
    }

    if (filterStatus?.trim()) {
      queryParams += `&filter=${encodeURIComponent(filterStatus)}`;
    }

    const url = queryParams
      ? `${getApiRoute(role)}/bookings?${queryParams}`
      : `${getApiRoute(role)}/bookings`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.bookings || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`error fetching the bookings for ${role}:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const bookingDetails = async (
  bookingId: string,
  role: string
): Promise<BookingDetailsResponse> => {
  try {
    let apiRoute = getApiRoute(role);
    const response = await axiosInstance.get(
      `${apiRoute}/bookingdetails/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const getBookingRating = async (bookingId: string, role: string) => {
  try {
    const response = await axiosInstance.get(
      `${getApiRoute(role)}/rating/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `error occured while fetching the rating for ${role}:`,
      error
    );
    throw error;
  }
};
