import axiosInstance from "../config/axios.config";
import cookies from "js-cookie";

interface JobDesignationResponse {
  message: string;
  success: boolean;
  designation: string[];
  status: number;
}

export const getJobDesignations = async (): Promise<string[]> => {
  const response = await axiosInstance.get<JobDesignationResponse>(
    "/technician/jobdesignations"
  );
  return response.data.designation;
};

export const submitTechnicianQualification = async (
  formdata: FormData
): Promise<void> => {
  console.log("entering into the form submitting to the backend");
  const token = cookies.get("technician_access_token");
  console.log("token:", token);

  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const isExpired = decoded.exp * 1000 < Date.now();
    console.log("Token expired?", isExpired);
  }

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
