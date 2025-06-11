import { useCallback } from "react";
import { getUserBookings } from "../services/common.services";
import { usePaginatedList } from "./usePaginatedList";
import { IBooking } from "../models/booking";
import { useNavigate } from "react-router-dom";

const useBookings = () => {
  const navigate = useNavigate();

  const {
    data: bookings,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<IBooking>(getUserBookings);

  const handleViewDetails = useCallback(
    (bookingId: string) => {
      console.log("Viewing details for booking:", bookingId);
      navigate(`/user/bookingdetails/${bookingId}`);
    },
    [navigate],
  );

  return {
    bookings,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    handleViewDetails,
  };
};

export default useBookings;