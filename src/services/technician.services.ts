import axiosInstance from "../config/axios.config";
import {
  CreateTimeSlotsResponse,
  GetTimeSlotResponse,
  SubmitTechnicianQualificationResponse,
  TimeSlotData,
} from "../types/technicians.types";

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<SubmitTechnicianQualificationResponse> => {
  try {
    const response =
      await axiosInstance.patch<SubmitTechnicianQualificationResponse>(
        "/api/technician/qualifications",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error("Error submitting qualification:", error);
    throw error;
  }
};

export const createTimeSlots = async (
  timeSlotData: TimeSlotData
): Promise<CreateTimeSlotsResponse> => {
  try {
    const response = await axiosInstance.post<CreateTimeSlotsResponse>(
      "/api/technician/addtimeslot",
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
      "/api/technician/timeslot",
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
      `/api/technician/blockslot/${slotId}`
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
