import { useState } from "react";
import {
  getAllTechnicians,
  toggleTechnicianStatus,
} from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { Itechnician } from "../models/technician";

const useTechnicians = () => {
  const {
    data: technicians,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Itechnician>(getAllTechnicians);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null,
  );

  const handleStatusToggle = async (technicianId: string) => {
    setStatusUpdateLoading(technicianId);
    try {
      const result = await toggleTechnicianStatus(technicianId);
      if (result) {
        setData((prevTechnicians) =>
          prevTechnicians.map((technician) =>
            technician._id === technicianId
              ? result.data || { ...technician, status: !technician.status }
              : technician,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle technician status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    technicians,
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

export default useTechnicians;
