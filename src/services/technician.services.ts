import axiosInstance from "../config/axios.config";
import cookies from "js-cookie";
import { Itechnician } from "../models/technician";

interface JobDesignationResponse {
  message: string;
  success: boolean;
  designation: string[];
  status: number;
}

interface submitTechnicianQualificationResponse {
  message: string;
  success: boolean;
  status: number;
  technician: Pick<
    Itechnician,
    "yearsOfExperience" | "Designation" | "About" | "image" | "certificates"
  >;
}

export const getJobDesignations = async (): Promise<string[]> => {
  const response = await axiosInstance.get<JobDesignationResponse>(
    "/technician/jobdesignations"
  );
  return response.data.designation;
};

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<submitTechnicianQualificationResponse> => {
  const token = cookies.get("technician_access_token");
  const response = await axiosInstance.patch(
    "/technician/qualifications",
    formdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getTechnicianProfile = async () => {
  const token = cookies.get("technician_access_token");
  try {
    const response = await axiosInstance.get("/technician/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the technician profile:", error);
  }
};
