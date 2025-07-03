import React, { useState } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { getBookingsColumns } from "../../../constants/tablecolumns/BookingsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import useBookings from "../../../hooks/useBookings";
import Modal from "../../../components/common/Modal";
import { TechnicianCancellationPolicy } from "../../../components/technician/TechnicianCancellationPolicy";
import { IBooking } from "../../../models/booking";
import { cancelBooking } from "../../../services/technician.services";
import { showToast } from "../../../utils/toast";

export const TechnicianJobListing: React.FC = () => {
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    bookings,
    setData: setBookings,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    handleViewDetails,
  } = useBookings("technician");

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const handleConfirmCancellation = async () => {
    if (selectedBooking && cancellationReason.trim()) {
      setIsCancelling(true);

      try {
        const response = await cancelBooking(
          selectedBooking._id,
          cancellationReason
        );

        if (response.success) {
          setBookings(
            bookings.map((booking) =>
              booking._id === selectedBooking._id
                ? response.data.booking
                : booking
            )
          );

          showToast({
            message: response.message,
            type: "success",
          });

          setIsModalOpen(false);
          setSelectedBooking(null);
          setCancellationReason("");
        } else {
          showToast({
            message: response.message || "Failed to cancel booking",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error in cancellation:", error);
        showToast({
          message: "Failed to cancel booking. Please try again.",
          type: "error",
        });
      } finally {
        setIsCancelling(false);
      }
    } else {
      showToast({
        message: "Please provide a cancellation reason",
        type: "error",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setCancellationReason("");
  };

  const getTechnicianCancellationPolicyData = (booking: IBooking) => {
    if (!booking) return {};

    const dateStr = booking.timeSlotId.date;
    const timeStr = booking.timeSlotId.startTime;

    const [day, month, year] = dateStr.split("-");
    const jsDateStr = `${month}/${day}/${year} ${timeStr}`;

    const scheduledDate = new Date(jsDateStr);
    const now = new Date();

    const hoursUntilService =
      (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check if booking is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(scheduledDate);
    bookingDate.setHours(0, 0, 0, 0);
    const isToday = today.getTime() === bookingDate.getTime();

    return {
      id: booking._id,
      userName:
        typeof booking.userId === "object"
          ? booking.userId.username || "Customer"
          : "Customer",
      scheduledDate: scheduledDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      scheduledTime: scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      hoursUntilService: hoursUntilService,
      isToday: isToday,
    };
  };

  const columns = getBookingsColumns(
    handleViewDetails,
    "technician",
    undefined, // handleCompleteBooking
    handleCancelBooking,
    undefined, // handleChatWithTechnician
    undefined // handleRateService
  );

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600">
              View and manage your assigned jobs and appointments
            </p>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No jobs found</div>
              <p className="text-sm text-gray-400 mt-2">
                Your assigned jobs will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow">
                <Table
                  data={bookings || []}
                  columns={columns}
                  currentPage={currentPage}
                  loading={loading}
                  pageSize={itemsPerPage}
                />
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title="Are you sure you want to cancel this job?"
            cancelText="Keep Job"
            confirmText={isCancelling ? "Cancelling..." : "Cancel Job"}
            confirmButtonColor="red"
            onConfirm={handleConfirmCancellation}
            className="max-w-4xl w-full mx-4"
            disabled={isCancelling}
          >
            {selectedBooking && (
              <TechnicianCancellationPolicy
                booking={getTechnicianCancellationPolicyData(selectedBooking)}
                reason={cancellationReason}
                onReasonChange={setCancellationReason}
              />
            )}
          </Modal>
        </div>
      </div>
    </TechnicianLayout>
  );
};
