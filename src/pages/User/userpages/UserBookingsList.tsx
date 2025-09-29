import React, { useState, useEffect } from "react";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import { getBookingsColumns } from "../../../constants/tablecolumns/BookingsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import { UserCancellationPolicy } from "../../../components/user/UserCancellationPolicy";
import { IBooking } from "../../../models/booking";
import { ChatModal } from "../../../components/common/ChatModal";
import {
  cancelBooking,
  createBookingRating,
  getBookings,
} from "../../../services/bookingService";
import { showToast } from "../../../utils/toast";
import { Rating } from "../../../components/user/Rating";
import {
  connectSocket,
  joinChat,
  leaveChat,
  sendMessage,
  listenForMessages,
  stopListeningForMessages,
} from "../../../utils/socket/socket";
import { IChat } from "../../../models/chat";
import {
  getChatMessages,
  sendChatMessage,
} from "../../../services/chatService";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useNavigate } from "react-router-dom";

export const UserBookingsList: React.FC = () => {
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatBooking, setSelectedChatBooking] =
    useState<IBooking | null>(null);
  const [messages, setMessages] = useState<IChat[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedRatingBooking, setSelectedRatingBooking] =
    useState<IBooking | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const {
    data: bookings,
    setData: setBookings,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(getBookings, "", "", itemsPerPage);

  const handleViewDetails = (bookingId: string) => {
    navigate(`/user/bookings/${bookingId}`);
  };

  useEffect(() => {
    connectSocket();

    listenForMessages((newMessage: IChat) => {
      console.log("Received new message:", newMessage);

      if (newMessage.senderType !== "user") {
        setMessages((prev) => [...prev, newMessage]);

        if (!isChatModalOpen) {
          showToast({
            message: "New message received",
            type: "info",
          });
        }
      }
    });

    return () => {
      stopListeningForMessages();
    };
  }, [isChatModalOpen]);

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const fetchChatMessages = async (bookingId: string) => {
    setChatLoading(true);
    try {
      const response = await getChatMessages(bookingId);
      console.log(
        "response in the userbooking list page for the chat:",
        response
      );
      if (response.success) {
        setMessages(response.data || []);
      } else {
        showToast({
          message: response.message || "Failed to load messages",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      showToast({
        message: "Failed to load messages",
        type: "error",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatWithTechnician = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedChatBooking(booking);
      setIsChatModalOpen(true);

      joinChat(bookingId);

      fetchChatMessages(bookingId);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!selectedChatBooking || sending) return;

    setSending(true);

    try {
      const technicianId =
        typeof selectedChatBooking.technicianId === "string"
          ? selectedChatBooking.technicianId
          : selectedChatBooking.technicianId?._id;

      if (!technicianId) {
        showToast({
          message: "Technician ID not found",
          type: "error",
        });
        return;
      }

      const response = await sendChatMessage(
        selectedChatBooking._id,
        messageText,
        technicianId,
        "user"
      );

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data!]);

        sendMessage(selectedChatBooking._id, messageText, "user");

        console.log("Message sent successfully:", response.data);
      } else {
        showToast({
          message: response.message || "Failed to send message",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";

      sendMessage(selectedChatBooking._id, messageText, "user");

      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const handleRateService = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedRatingBooking(booking);
      setRating(0);
      setReview("");
      setIsRatingModalOpen(true);
    }
  };

  const handleRatingConfirm = async () => {
    if (!selectedRatingBooking || rating === 0) {
      showToast({
        message: "Please select a rating",
        type: "error",
      });
      return;
    }

    setIsSubmittingRating(true);

    try {
      const response = await createBookingRating(
        selectedRatingBooking._id,
        rating,
        review
      );

      if (response.success) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedRatingBooking._id
              ? { ...booking, isRated: true }
              : booking
          )
        );

        showToast({
          message: response.message || "Rating submitted successfully!",
          type: "success",
        });

        setIsRatingModalOpen(false);
        setSelectedRatingBooking(null);
        setRating(0);
        setReview("");
      } else {
        showToast({
          message: response.message || "Failed to submit rating",
          type: "error",
        });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      showToast({
        message: errorMessage,
        type: "error",
      });
      throw new Error(errorMessage);
    } finally {
      setIsSubmittingRating(false);
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

  const handleChatModalClose = () => {
    if (selectedChatBooking) {
      leaveChat(selectedChatBooking._id);
    }

    setIsChatModalOpen(false);
    setSelectedChatBooking(null);
    setMessages([]);
  };

  const handleRatingModalClose = () => {
    setIsRatingModalOpen(false);
    setSelectedRatingBooking(null);
    setRating(0);
    setReview("");
  };

  const getCancellationPolicyData = (booking: IBooking) => {
    console.log("booking:", booking);
    if (!booking) return {};

    const dateStr = booking.timeSlotId.date;
    console.log("dateStr:", dateStr);
    const timeStr = booking.timeSlotId.startTime;
    console.log("timeStrr:", timeStr);

    const [day, month, year] = dateStr.split("-");
    const jsDateStr = `${month}/${day}/${year} ${timeStr}`;

    const scheduledDate = new Date(jsDateStr);
    const now = new Date();

    const hoursUntilService =
      (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 0;
    if (hoursUntilService >= 6) {
      refundPercentage = 100;
    } else if (hoursUntilService >= 2) {
      refundPercentage = 50;
    }

    const refundAmount = (booking.bookingAmount * refundPercentage) / 100;

    return {
      service:
        typeof booking.serviceId === "object"
          ? booking.serviceId.name
          : "Service",
      scheduledDate: scheduledDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      scheduledTime: scheduledDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amountPaid: booking.bookingAmount,
      refundAmount: refundAmount,
      refundPercentage: refundPercentage,
    };
  };

  const columns = getBookingsColumns(
    handleViewDetails,
    "user",
    undefined,
    handleCancelBooking,
    handleChatWithTechnician,
    handleRateService
  );

  return (
    <UserLayout>
      <div className="flex h-full">
        <UserProfileSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              View and manage your service bookings and appointments
            </p>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No bookings found</div>
              <p className="text-sm text-gray-400 mt-2">
                Your bookings will appear here once you make a booking
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
            title={
              selectedBooking
                ? `Are you sure you want to cancel ${getCancellationPolicyData(selectedBooking).service}?`
                : "Cancel Booking"
            }
            cancelText="Keep Booking"
            confirmText={isCancelling ? "Cancelling..." : "Cancel Booking"}
            confirmButtonColor="red"
            onConfirm={handleConfirmCancellation}
            className="max-w-4xl w-full mx-4"
            disabled={isCancelling}
          >
            {selectedBooking && (
              <UserCancellationPolicy
                booking={getCancellationPolicyData(selectedBooking)}
                reason={cancellationReason}
                onReasonChange={setCancellationReason}
              />
            )}
          </Modal>

          <Modal
            isOpen={isRatingModalOpen}
            onClose={handleRatingModalClose}
            title="Rate This Service"
            cancelText="Cancel"
            confirmText={isSubmittingRating ? "Submitting..." : "Submit Rating"}
            onConfirm={handleRatingConfirm}
            className="max-w-lg"
            disabled={isSubmittingRating}
          >
            <Rating
              rating={rating}
              setRating={setRating}
              review={review}
              setReview={setReview}
            />
          </Modal>

          <ChatModal
            isOpen={isChatModalOpen}
            onClose={handleChatModalClose}
            booking={selectedChatBooking}
            messages={messages}
            loading={chatLoading}
            onSendMessage={handleSendMessage}
            sending={sending}
            currentUserType="user"
          />
        </div>
      </div>
    </UserLayout>
  );
};
