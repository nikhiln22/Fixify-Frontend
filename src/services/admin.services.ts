import axiosInstance from "../config/axios.config";

export const getAllDesignations = async (page: number) => {
  const response = await axiosInstance.get(`/admin/designations?page=${page}`);
  return response.data;
};

export const toggleDesignationStatus = async (id: string) => {
  const response = await axiosInstance.patch(
    `/admin/designations/${id}/toggle`,
  );
  return response.data;
};
