import { useCallback } from "react";
import { getBookings } from "../services/common.services";
import { usePaginatedList } from "./usePaginatedList";
import { IBooking } from "../models/booking";
import { useNavigate } from "react-router-dom";

const useBookings = (role: "user" | "technician" | "admin" = "user") => {
  const navigate = useNavigate();

  const getBookingsWithRole = useCallback(
    (page?: number) => getBookings(page, role),
    [role]
  );

  const {
    data: bookings,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<IBooking>(getBookingsWithRole);

  const handleViewDetails = useCallback(
    (bookingId: string) => {
      console.log(`Viewing details for ${role} booking:`, bookingId);

      switch (role) {
        case "technician":
          navigate(`/technician/jobdetails/${bookingId}`);
          break;
        case "admin":
          navigate(`/admin/bookings/${bookingId}`);
          break;
        case "user":
        default:
          navigate(`/user/bookings/${bookingId}`); 
      }
    },
    [navigate, role]
  );

  const handleUpdateJobStatus = useCallback(
    (bookingId: string, status: string) => {
      if (role !== "technician") return;

      console.log("Updating job status:", bookingId, status);
    },
    [role]
  );

  const handleCancelBooking = useCallback(
    (bookingId: string) => {
      if (role !== "user" && role !== "technician") return;

      console.log(`Canceling booking for ${role}:`, bookingId);
    },
    [role]
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
    handleUpdateJobStatus:
      role === "technician" ? handleUpdateJobStatus : undefined,
    handleCancelBooking:
      role === "user" || role === "technician"
        ? handleCancelBooking
        : undefined,
  };
};

export default useBookings;
