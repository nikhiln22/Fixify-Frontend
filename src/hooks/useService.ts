import { useState } from "react";
import { getAllServices, toggleServiceStatus } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { IService } from "../models/service";

const useServices = () => {
  const {
    data: services,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error
  } = usePaginatedList<IService>(getAllServices);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const handleStatusToggle = async (serviceId: string) => {
    setStatusUpdateLoading(serviceId);
    try {
      const result = await toggleServiceStatus(serviceId);
      if (result) {
        setData(prevServices =>
          prevServices.map(service =>
            service._id === serviceId
              ? (result.data || { ...service, status: !service.status })
              : service
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    services,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading
  };
};

export default useServices;