import axiosInstance from "../config/axios.config";
import { IBooking } from "../models/booking";
import { Icategory } from "../models/category";
import { Idesignation } from "../models/designation";
import { IService } from "../models/service";
import { Itechnician } from "../models/technician";
import { TechnicianProfileResponse } from "../types/technicians.types";
import {
  BookingDetailsResponse,
} from "../types/user.types";
import { Role } from "../types/auth.types";
import { IChat } from "../models/chat";
import { TECHNICIAN_API, ADMIN_API, USER_API } from "../constants/apiRoutes";

export const getAllDesignations = async (
  page?: number,
  search?: string,
  role: "admin" | "technician" = "admin",
  filterStatus?: string
): Promise<
  | { _id: string; name: string }[]
  | {
      data: Idesignation[];
      totalPages: number;
      currentPage: number;
      total: number;
    }
> => {
  try {
    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl =
      role === "admin"
        ? `${ADMIN_API}/jobdesignations`
        : `${TECHNICIAN_API}/jobdesignations`;

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    const response = await axiosInstance.get(url);

    if (role === "technician") {
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data.designations)
      ) {
        return response.data.data.designations.map((item: any) => ({
          _id: item._id,
          name: item.designation,
        }));
      }

      return [];
    }

    return {
      data: response.data.data.designations || [],
      totalPages: response.data.data.pagination?.pages || 1,
      currentPage: response.data.data.pagination?.page || page || 1,
      total: response.data.data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching designations:", error);

    if (role === "technician") {
      return [];
    }

    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getAllCategories = async (
  page?: number,
  search?: string,
  role: "admin" | "user" = "admin",
  filterStatus?: string
): Promise<{
  data: Icategory[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the categories for ${role}`);

    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }
      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl =
      role === "admin" ? `${ADMIN_API}/categories` : `${USER_API}/categories`;

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log("response:", response);

    return {
      data: response.data.data?.categories || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`error fetching the categories for ${role}:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getAllServices = async (
  page?: number,
  search?: string,
  categoryId?: string,
  role: "admin" | "user" = "admin",
  filterStatus?: string
): Promise<{
  data: IService[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the services for ${role}`);
    let queryParams = "";

    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;

      if (search && search.trim() !== "") {
        queryParams += `&search=${encodeURIComponent(search)}`;
      }

      if (categoryId && categoryId.trim() !== "") {
        queryParams += `&category=${categoryId}`;
      }

      if (filterStatus && filterStatus.trim() !== "") {
        queryParams += `&status=${encodeURIComponent(filterStatus)}`;
      }
    }

    const baseUrl =
      role === "admin" ? `${ADMIN_API}/services` : `${USER_API}/services`;
    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log(`services response for ${role}:`, response);

    return {
      data: response.data.data?.services || [],
      totalPages: response.data.data?.pagination?.pages || 1,
      currentPage: response.data.data?.pagination?.page || page || 1,
      total: response.data.data?.pagination?.total || 0,
    };
  } catch (error) {
    console.error(`Error fetching the services for ${role}:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page || 1,
      total: 0,
    };
  }
};

export const getTechnicianProfile = async (
  role: "admin" | "technician" = "technician",
  technicianId?: string
): Promise<Itechnician> => {
  try {
    console.log(`fetching technician profile for ${role}`);

    let url: string;

    if (role === "technician") {
      url = `${TECHNICIAN_API}/profile`;
    } else if (role === "admin") {
      if (!technicianId) {
        throw new Error("Technician ID is required for admin access");
      }
      url = `${ADMIN_API}/technicianprofile/${technicianId}`;
    } else {
      throw new Error("Invalid role specified");
    }

    const response = await axiosInstance.get<TechnicianProfileResponse>(url);

    console.log(`technician profile response for ${role}:`, response);

    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Technician data not found in response");
    }
  } catch (error) {
    console.error(`Error fetching technician profile for ${role}:`, error);
    throw error;
  }
};

export const getBookings = async (
  page?: number,
  role: "user" | "technician" | "admin" = "user",
  search?: string,
  filter?: string
): Promise<{
  data: IBooking[];
  totalPages: number;
  currentPage: number;
  total: number;
}> => {
  try {
    console.log(`fetching the bookings for ${role}`);

    let queryParams = "";
    if (page !== undefined) {
      queryParams += `page=${page}&limit=6`;
    }

    if (search && search.trim() !== "") {
      queryParams += `&search=${encodeURIComponent(search)}`;
    }

    if (filter && filter.trim() !== "") {
      queryParams += `&filter=${encodeURIComponent(filter)}`;
    }

    let baseUrl = "";
    switch (role) {
      case "user":
        baseUrl = `${USER_API}/bookings`;
        break;
      case "technician":
        baseUrl = `${TECHNICIAN_API}/bookings`;
        break;
      case "admin":
        baseUrl = `${ADMIN_API}/bookings`;
        break;
      default:
        baseUrl = `${USER_API}/bookings`;
    }

    const url = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await axiosInstance.get(url);
    console.log("bookings response in common service:", response);

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
  role: Role
): Promise<BookingDetailsResponse> => {
  try {
    const response = await axiosInstance.get(
      `/api/${role.toLowerCase()}/bookingdetails/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.log("error occured while booking the service by the user:", error);
    throw error;
  }
};

export const getChatMessages = async (
  bookingId: string,
  role: "user" | "technician" = "user"
): Promise<{
  data: IChat[];
  success: boolean;
  message?: string;
}> => {
  try {
    console.log(`fetching chat messages for ${role}`);

    const baseUrl =
      role === "user"
        ? `${USER_API}/chatmessages/${bookingId}`
        : `${TECHNICIAN_API}/chatmessages/${bookingId}`;

    const response = await axiosInstance.get(baseUrl);
    console.log("chat messages response:", response);

    return {
      data: response.data.data || [],
      success: response.data.success || true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`error fetching chat messages for ${role}:`, error);
    return {
      data: [],
      success: false,
      message: "Failed to fetch messages",
    };
  }
};

export const sendChatMessage = async (
  bookingId: string,
  messageText: string,
  recipientId: string,
  role: "user" | "technician" = "user"
): Promise<{
  data?: IChat;
  success: boolean;
  message?: string;
}> => {
  try {
    console.log(`sending chat message for ${role}`);

    const baseUrl =
      role === "user"
        ? `${USER_API}/sendchatmessages/${bookingId}`
        : `${TECHNICIAN_API}/sendchatmessages/${bookingId}`;

    const requestBody = {
      messageText,
      senderType: role,
      ...(role === "user"
        ? { technicianId: recipientId }
        : { userId: recipientId }),
    };

    console.log("Request body:", requestBody);

    const response = await axiosInstance.post(baseUrl, requestBody);

    console.log("send message response:", response);

    return {
      data: response.data.data,
      success: response.data.success || true,
      message: response.data.message,
    };
  } catch (error) {
    console.error(`error sending chat message for ${role}:`, error);
    throw error;
  }
};

export const getRating = async (
  bookingId: string,
  role: "user" | "technician" | "admin"
) => {
  try {
    const response = await axiosInstance.get(
      `/api/${role}/rating/${bookingId}`
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
