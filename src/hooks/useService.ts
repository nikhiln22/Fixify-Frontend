import { useState } from "react";
import { toggleServiceStatus } from "../services/admin.services";
import { getAllServices } from "../services/common.services";
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
      console.log("toggling the service status");
      const result = await toggleServiceStatus(serviceId);
      console.log("result from the useService hook");
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