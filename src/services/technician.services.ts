import axiosInstance from "../config/axios.config";
import cookies from "js-cookie";
import {
  SubmitTechnicianQualificationResponse,
  TechnicianProfileResponse,
} from "../types/technicians.types";

export const submitTechnicianQualification = async (
  formdata: FormData,
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
        },
      );
    return response.data;
  } catch (error) {
    console.error("Error submitting qualification:", error);
    throw error;
  }
};

export const getTechnicianProfile =
  async (): Promise<TechnicianProfileResponse> => {
    const token = cookies.get("technician_access_token");
    try {
      const response = await axiosInstance.get<TechnicianProfileResponse>(
        "/api/technician/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching the technician profile:", error);
      throw error;
    }
  };
