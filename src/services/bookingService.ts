import axiosInstance from "../config/axios.config";
import { BOOKINGS_API } from "../constants/apiRoutes";
import { IBooking } from "../models/booking";
import {
  StartServicePayload,
  VerifyOtpPayload,
} from "../types/technicians.types";
import {
  BookingDetailsResponse,
  BookServiceResponse,
  CreateBookingRequest,
} from "../types/user.types";

export const bookService = async (
  bookingData: CreateBookingRequest
): Promise<BookServiceResponse> => {
  try {
    const response = await axiosInstance.post(`${BOOKINGS_API}`, bookingData);
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const verifyPaymentSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get(
      `${BOOKINGS_API}/${sessionId}/verify-payment`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while verifypayment session:", error);
    throw error;
  }
};

export const startService = async (
  bookingId: string,
  serviceStartTime?: Date
) => {
  try {
    const payload: StartServicePayload = {};

    if (serviceStartTime) {
      payload.serviceStartTime = serviceStartTime.toISOString();
    }

    const response = await axiosInstance.patch(
      `${BOOKINGS_API}/${bookingId}/start`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error starting service:", error);
    throw error;
  }
};

export const createBookingRating = async (
  bookingId: string,
  rating: number,
  review: string
) => {
  try {
    const response = await axiosInstance.post(
      `${BOOKINGS_API}/${bookingId}/rate`,
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
  cancellationReason: string
) => {
  try {
    const response = await axiosInstance.put(
      `${BOOKINGS_API}/${bookingId}/cancel`,
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
    console.log(`fetching the bookings`);

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
      ? `${BOOKINGS_API}?${queryParams}`
      : `${BOOKINGS_API}`;

    const response = await axiosInstance.get(url);

    return {
      data: response.data.data?.bookings || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`error fetching the bookings`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const bookingDetails = async (
  bookingId: string
): Promise<BookingDetailsResponse> => {
  try {
    const response = await axiosInstance.get(`${BOOKINGS_API}/${bookingId}`);
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const getBookingRating = async (bookingId: string) => {
  try {
    const response = await axiosInstance.get(
      `${BOOKINGS_API}/${bookingId}/rating`
    );
    return response.data;
  } catch (error) {
    console.error(`error occured while fetching the rating`, error);
    throw error;
  }
};

export const generateCompletionOtp = async (bookingId: string) => {
  try {
    const response = await axiosInstance.post(
      `${BOOKINGS_API}/${bookingId}/generate-completion-otp`
    );
    return response;
  } catch (error) {
    console.log("error occured while genertaing the completion otp:", error);
    throw error;
  }
};

export const verifyCompletionOtp = async (
  bookingId: string,
  otp: string,
  serviceEndTime?: Date
) => {
  try {
    const payload: VerifyOtpPayload = { otp };

    if (serviceEndTime) {
      payload.serviceEndTime = serviceEndTime.toISOString();
    }
    const response = await axiosInstance.post(
      `${BOOKINGS_API}/${bookingId}/verify-completion-otp`,
      { payload }
    );
    return response.data;
  } catch (error) {
    console.log("error occured while veryfying the completion otp:", error);
    throw error;
  }
};

export const completeFinalPayment = async (paymentData: {
  bookingId: string;
  paymentMethod: string;
  finalAmount: number;
  offerId: string;
  couponId: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `${BOOKINGS_API}/${paymentData.bookingId}/complete-payment`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.log("error occured while making the payment:", error);
    throw error;
  }
};
