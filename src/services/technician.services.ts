import axiosInstance from "../config/axios.config";
import cookies from "js-cookie";
import {
  JobDesignationResponse,
  SubmitTechnicianQualificationResponse,
  TechnicianProfileResponse
} from "../types/technicians.types";

export const getJobDesignations = async (): Promise<string[]> => {
  try {
    const token = cookies.get("technician_access_token");
    const response = await axiosInstance.get<JobDesignationResponse>(
      "/technician/jobdesignations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.designation;
  } catch (error) {
    console.error("Error fetching job designations:", error);
    return [];
  }
};

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<SubmitTechnicianQualificationResponse> => {
  try {
    const response = await axiosInstance.patch<SubmitTechnicianQualificationResponse>(
      "/technician/qualifications",
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

export const getTechnicianProfile = async (): Promise<TechnicianProfileResponse> => {
  const token = cookies.get("technician_access_token");
  try {
    const response = await axiosInstance.get<TechnicianProfileResponse>(
      "/technician/profile", 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching the technician profile:", error);
    throw error;
  }
};