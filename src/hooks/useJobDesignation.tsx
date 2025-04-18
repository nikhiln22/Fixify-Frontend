import {
  getAllDesignations,
  toggleDesignationStatus,
} from "../services/admin.services";
import { showToast } from "../utils/toast";
import { usePaginatedList } from "./usePaginatedList";
import { Idesignation } from "../models/designation";
import { useState, useEffect } from "react";

export default function useJobDesignations() {
  const {
    data: fetchedDesignations,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch,
    loading: hookLoading,
    error,
  } = usePaginatedList<Idesignation>(getAllDesignations);

  const [designations, setDesignations] = useState<Idesignation[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (fetchedDesignations) {
      setDesignations(fetchedDesignations);
    }
  }, [fetchedDesignations]);
  
  const handleStatusToggle = async (id: string) => {
    try {
      setLoading(true);
      console.log("id in the useJobDesignation hook", id);
      
      setDesignations(prevDesignations =>
        prevDesignations.map(designation =>
          designation._id === id
            ? { ...designation, Status: !designation.Status }
            : designation
        )
      );
      
      const res = await toggleDesignationStatus(id);
      console.log("response from the useJObDesignation hook:", res);
      showToast({ message: res.message, type: "success" });
      
    } catch (err) {
      setDesignations(fetchedDesignations);
      
      const error = err as { response?: { data?: { message?: string } } };
      showToast({
        message:
          error?.response?.data?.message || "Failed to update the status",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    designations: designations.length > 0 ? designations : fetchedDesignations,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    refreshDesignations: refetch,
    loading: hookLoading || loading,
    error,
  };
}

export { default as useJobDesignations } from "./useJobDesignation";