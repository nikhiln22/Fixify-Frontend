import {
  getAllDesignations,
  toggleDesignationStatus,
} from "../services/admin.services";
import { showToast } from "../utils/toast";
import { usePaginatedList } from "./usePaginatedList";
import { Idesignation } from "../models/designation";

export const useJobDesignations = () => {
  const {
    data: designations,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch,
    loading,
    error,
  } = usePaginatedList<Idesignation>(getAllDesignations);

  const handleStatusToggle = async (id: string) => {
    try {
      const res = await toggleDesignationStatus(id);
      showToast({ message: res.message, type: "success" });
      refetch();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast({
        message:
          error?.response?.data?.message || "Failed to update the status",
        type: "error",
      });
    }
  };

  return {
    designations,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    loading,
    error,
  };
};
