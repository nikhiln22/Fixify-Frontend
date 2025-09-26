import axiosInstance from "../config/axios.config";
import {
  CreateTimeSlotsResponse,
  GetTimeSlotResponse,
  ITimeSlotData,
} from "../types/technicians.types";
import { TIMESLOTS_API } from "../constants/apiRoutes";

export const createTimeSlots = async (
  timeSlotData: ITimeSlotData
): Promise<CreateTimeSlotsResponse> => {
  try {
    const response = await axiosInstance.post<CreateTimeSlotsResponse>(
      `${TIMESLOTS_API}`,
      timeSlotData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating time slots:", error);
    throw error;
  }
};

export const getTimeSlots = async (options?: {
  includePast: boolean;
}): Promise<GetTimeSlotResponse> => {
  const params: Record<string, string> = {};
  if (options?.includePast !== undefined) {
    params.includePast = options.includePast.toString();
  }
  try {
    const response = await axiosInstance.get<GetTimeSlotResponse>(
      `${TIMESLOTS_API}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};

export const blockTimeSlot = async (slotId: string) => {
  try {
    const response = await axiosInstance.patch(
      `${TIMESLOTS_API}/${slotId}/block`
    );
    return response.data;
  } catch (error) {
    console.log(
      "error occurred while blocking the technician time slot:",
      error
    );
    throw error;
  }
};

export const getAvailableTimeSlots = async (
  technicianId: string,
  includePast: boolean
): Promise<GetTimeSlotResponse> => {
  try {
    const response = await axiosInstance.get(
      `${TIMESLOTS_API}/available/${technicianId}`,
      {
        params: {
          includePast: includePast,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};
