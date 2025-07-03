import React from "react";
import {
  CreditCard,
  Wallet,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface BookingStatusCardProps {
  bookingDate: string | Date;
  paymentMethod?: "Online" | "Wallet";
  status: "Pending" | "Booked" | "Cancelled" | "Completed";
  paymentStatus?: "Paid" | "Refunded";
  bookingId?: string;
  userType?: "user" | "technician" | "admin";
}

export const BookingStatusCard: React.FC<BookingStatusCardProps> = ({
  bookingDate,
  paymentMethod,
  status,
  paymentStatus,
  bookingId,
  userType = "user",
}) => {
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPaymentMethodIcon = (method?: "Online" | "Wallet") => {
    switch (method) {
      case "Online":
        return <CreditCard className="w-5 h-5" />;
      case "Wallet":
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getBookingStatusIcon = (
    status: "Pending" | "Booked" | "Cancelled" | "Completed"
  ) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Booked":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBookingStatusBadge = (
    status: "Pending" | "Booked" | "Cancelled" | "Completed"
  ) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      Booked: { color: "bg-blue-100 text-blue-800", label: "Booked" },
      Completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      Cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusIcon = (paymentStatus?: "Paid" | "Refunded") => {
    switch (paymentStatus) {
      case "Paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Refunded":
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPaymentStatusBadge = (
    paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded"
  ) => {
    const statusConfig = {
      Paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      Pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      Failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      Refunded: { color: "bg-purple-100 text-purple-800", label: "Refunded" },
    };

    const config = statusConfig[paymentStatus];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Show payment info only for user and admin, not for technician
  const showPaymentInfo = userType !== "technician";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Booking Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Booking Date - Always show */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Booking Date
          </h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-900">{formatDate(bookingDate)}</p>
          </div>
        </div>

        {/* Payment Method - Only for user and admin */}
        {showPaymentInfo && (
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Payment Method
            </h3>
            <div className="flex items-center space-x-2">
              <div className="text-gray-400">
                {getPaymentMethodIcon(paymentMethod)}
              </div>
              <p className="text-sm text-gray-900">
                {paymentMethod || "Not specified"}
              </p>
            </div>
          </div>
        )}

        {/* Payment Status - Only for user and admin */}
        {showPaymentInfo && (
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Payment Status
            </h3>
            <div className="flex items-center space-x-2">
              {getPaymentStatusIcon(paymentStatus)}
              {paymentStatus ? (
                getPaymentStatusBadge(paymentStatus)
              ) : (
                <p className="text-sm text-gray-900">Not specified</p>
              )}
            </div>
          </div>
        )}

        {/* Booking Status - Always show */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            {userType === "technician" ? "Job Status" : "Booking Status"}
          </h3>
          <div className="flex items-center space-x-2">
            {getBookingStatusIcon(status)}
            {getBookingStatusBadge(status)}
          </div>
        </div>

        {/* Booking ID - Always show if provided */}
        {bookingId && (
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              {userType === "technician" ? "Job ID" : "Booking ID"}
            </h3>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-900 font-mono">
                #{bookingId.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};