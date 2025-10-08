import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { getBookingsColumns } from "../../../constants/tablecolumns/BookingsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import OTPInput from "../../../components/common/OtpInput";
import { TechnicianCancellationPolicy } from "../../../components/technician/TechnicianCancellationPolicy";
import { IBooking } from "../../../models/booking";
import {
  cancelBooking,
  generateCompletionOtp,
  startService,
  verifyCompletionOtp,
} from "../../../services/bookingService";
import { showToast } from "../../../utils/toast";
import { ChatModal } from "../../../components/common/ChatModal";
import SelectField from "../../../components/common/SelectField";
import { getBookings } from "../../../services/bookingService";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
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
import { useNavigate } from "react-router-dom";

export const TechnicianJobListing: React.FC = () => {
  const navigate = useNavigate();
  const itemsPerPage = 6;
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedCompletionBooking, setSelectedCompletionBooking] =
    useState<IBooking | null>(null);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatBooking, setSelectedChatBooking] =
    useState<IBooking | null>(null);
  const [messages, setMessages] = useState<IChat[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const filterOptions = [
    { value: "", label: "All Jobs" },
    { value: "today", label: "Today's Jobs" },
    { value: "upcoming", label: "Upcoming Jobs" },
    { value: "completed", label: "Completed Jobs" },
    { value: "cancelled", label: "Cancelled Jobs" },
  ];

  const {
    data: bookings,
    setData: setBookings,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(getBookings, "", filterStatus, itemsPerPage);

  const handleViewDetails = (bookingId: string) => {
    navigate(`/technician/jobdetails/${bookingId}`);
  };

  useEffect(() => {
    connectSocket();

    listenForMessages((newMessage: IChat) => {
      console.log("Received new message:", newMessage);

      if (newMessage.senderType !== "technician") {
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Filter changed to:", e.target.value);
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleStartService = async (bookingId: string) => {
    try {
      const response = await startService(bookingId);

      if (response.success) {
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, bookingStatus: response.data.bookingStatus }
              : booking
          )
        );

        showToast({
          message: "Service started successfully!",
          type: "success",
        });
      } else {
        showToast({
          message: response.message || "Failed to start the service",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error starting service:", error);
      showToast({
        message: "Failed to start the service. Please try again.",
        type: "error",
      });
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedCompletionBooking(booking);
      setOtp("");
      setIsOtpModalOpen(true);

      try {
        await generateCompletionOtp(bookingId);
        showToast({
          message: "OTP sent to customer",
          type: "success",
        });
      } catch (error) {
        console.log("error occured:", error);
        showToast({
          message: "Failed to generate OTP",
          type: "error",
        });
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!selectedCompletionBooking || otp.length !== 4) {
      showToast({
        message: "Please enter a valid 4-digit OTP",
        type: "error",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await verifyCompletionOtp(
        selectedCompletionBooking._id,
        otp
      );

      if (response.success) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedCompletionBooking._id
              ? { ...booking, bookingStatus: "Completed" }
              : booking
          )
        );

        showToast({
          message: "Job completed successfully!",
          type: "success",
        });

        handleOtpModalClose();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showToast({
        message: "Invalid OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

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

  const handleChatWithUser = (bookingId: string) => {
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
      const userId =
        typeof selectedChatBooking.userId === "string"
          ? selectedChatBooking.userId
          : selectedChatBooking.userId?._id;

      if (!userId) {
        showToast({
          message: "User ID not found",
          type: "error",
        });
        return;
      }

      const response = await sendChatMessage(
        selectedChatBooking._id,
        messageText,
        userId,
        "technician"
      );

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data!]);

        sendMessage(selectedChatBooking._id, messageText, "technician");

        console.log("Message sent successfully:", response.data);
      } else {
        showToast({
          message: response.message || "Failed to send message",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      sendMessage(selectedChatBooking._id, messageText, "technician");

      showToast({
        message: "Failed to send message",
        type: "error",
      });
    } finally {
      setSending(false);
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

  const handleOtpModalClose = () => {
    setIsOtpModalOpen(false);
    setSelectedCompletionBooking(null);
    setOtp("");
  };

  const handleChatModalClose = () => {
    if (selectedChatBooking) {
      leaveChat(selectedChatBooking._id);
    }

    setIsChatModalOpen(false);
    setSelectedChatBooking(null);
    setMessages([]);
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
    handleCompleteBooking,
    handleCancelBooking,
    handleChatWithUser,
    undefined,
    handleStartService
  );

  if (error) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-8">
            <div className="text-center text-red-600">
              <h2 className="text-xl font-semibold mb-2">Error Loading Jobs</h2>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                View and manage your assigned jobs and appointments
              </p>
              <div className="w-48">
                <SelectField
                  label=""
                  name="jobFilter"
                  value={filterStatus}
                  onChange={handleFilterChange}
                  options={filterOptions}
                  placeholder="Filter jobs"
                  className="mb-0"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {bookings.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {filterStatus === "today" && "No jobs scheduled for today"}
                {filterStatus === "upcoming" && "No upcoming jobs"}
                {filterStatus === "completed" && "No completed jobs"}
                {filterStatus === "cancelled" && "No cancelled jobs"}
                {filterStatus === "" && "No jobs assigned yet"}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {filterStatus === ""
                  ? "Jobs will appear here once they are assigned to you"
                  : "Try changing the filter to see other jobs"}
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
          >
            {selectedBooking && (
              <TechnicianCancellationPolicy
                booking={getTechnicianCancellationPolicyData(selectedBooking)}
                reason={cancellationReason}
                onReasonChange={setCancellationReason}
              />
            )}
          </Modal>

          <Modal
            isOpen={isOtpModalOpen}
            onClose={handleOtpModalClose}
            title="Please enter the OTP"
            cancelText="Cancel"
            confirmText={isVerifyingOtp ? "Verifying..." : "Complete Job"}
            confirmButtonColor="green"
            onConfirm={handleVerifyOtp}
            className="max-w-md"
          >
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="my-6">
                  <OTPInput length={4} value={otp} onchange={setOtp} />
                </div>
              </div>
            </div>
          </Modal>

          <ChatModal
            isOpen={isChatModalOpen}
            onClose={handleChatModalClose}
            booking={selectedChatBooking}
            messages={messages}
            loading={chatLoading}
            onSendMessage={handleSendMessage}
            sending={sending}
            currentUserType="technician"
          />
        </div>
      </div>
    </TechnicianLayout>
  );
};
