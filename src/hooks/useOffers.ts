import { useState } from "react";
import { toggleOfferStatus } from "../services/admin.services";
import { getAllOffers } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { IOffer } from "../models/offer";

const useOffers = () => {
  const {
    data: services,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<IOffer>(getAllOffers);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const handleStatusToggle = async (offerId: string) => {
    setStatusUpdateLoading(offerId);
    try {
      console.log("toggling the service status");
      const result = await toggleOfferStatus(offerId);
      console.log("result from the useService hook");
      if (result) {
        setData((prevServices) =>
          prevServices.map((offer) =>
            offer._id === offerId
              ? result.data || { ...offer, status: !offer.status }
              : offer
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
    statusUpdateLoading,
  };
};

export default useOffers;
