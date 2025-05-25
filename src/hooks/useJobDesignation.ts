import { useState } from "react";
import { toggleDesignationStatus } from "../services/admin.services";
import { getAllDesignations } from "../services/common.services";
import { usePaginatedList } from "./usePaginatedList";
import { Idesignation } from "../models/designation";

const useJobDesignations = () => {
  const {
    data: designations,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Idesignation>(getAllDesignations);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const handleStatusToggle = async (designationId: string) => {
    setStatusUpdateLoading(designationId);
    try {
      const result = await toggleDesignationStatus(designationId);
      if (result) {
        setData((prevDesignations) =>
          prevDesignations.map((designation) =>
            designation._id === designationId
              ? result.data || { ...designation, status: !designation.status }
              : designation
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle designation status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    designations,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading,
  };
};

export default useJobDesignations;
