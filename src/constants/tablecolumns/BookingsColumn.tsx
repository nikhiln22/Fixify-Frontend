import { IBooking } from "../../models/booking";
import { Column } from "../../types/component.types";

export const getBookingsColumns = (
  handleViewDetails: (id: string) => void,
  role: "user" | "technician" | "admin",
  handleCompleteBooking?: (id: string) => void,
  handleCancelBooking?: (id: string) => void,
  handleChatWithTechnician?: (id: string) => void,
  handleRateService?: (id: string) => void
): Column<IBooking>[] => {
  const baseColumns: Column<IBooking>[] = [
    {
      key: "_id",
      label: role === "technician" ? "Job ID" : "Booking ID",
      render: (item) => (
        <div className="text-center font-mono text-sm">
          #{item._id.slice(-8).toUpperCase()}
        </div>
      ),
    },
    {
      key: "serviceId",
      label: "Service Name",
      render: (item) => (
        <div className="text-center truncate">
          {typeof item.serviceId === "object" && item.serviceId?.name
            ? item.serviceId.name
            : "Service Name"}
        </div>
      ),
    },
  ];

  if (role === "technician") {
    baseColumns.push({
      key: "timeSlotId",
      label: "Service Date",
      render: (item) => (
        <div className="text-center font-medium">{item.timeSlotId.date}</div>
      ),
    });

    baseColumns.push({
      key: "timeSlotId",
      label: "Service Time",
      render: (item) => (
        <div className="text-center font-medium">
          {item.timeSlotId?.startTime && item.timeSlotId?.endTime
            ? `${item.timeSlotId.startTime} - ${item.timeSlotId.endTime}`
            : "N/A"}
        </div>
      ),
    });
  } else {
    baseColumns.push({
      key: "createdAt",
      label: "Booking Date",
      render: (item) => (
        <div className="text-center font-medium">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    });
  }

  baseColumns.push({
    key: "bookingAmount",
    label: role === "user" || role === "admin" ? "Amount Paid" : "Payout",
    render: (item) => (
      <div className="text-center font-medium">
        ₹
        {role === "technician"
          ? (item.bookingAmount * 0.8).toFixed(2)
          : item.bookingAmount}
      </div>
    ),
  });

  baseColumns.push({
    key: "bookingStatus",
    label: role === "technician" ? "Job Status" : "Booking Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            item.bookingStatus === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : item.bookingStatus === "Completed"
                ? "bg-green-100 text-green-800"
                : item.bookingStatus === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : item.bookingStatus === "Booked"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.bookingStatus}
        </span>
      </div>
    ),
  });

  if (role !== "technician") {
    baseColumns.push({
      key: "paymentId",
      label: "Payment Status",
      render: (item) => (
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              item.paymentId.paymentStatus === "Paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.paymentId.paymentStatus}
          </span>
        </div>
      ),
    });
  }

  baseColumns.push({
    key: "action",
    label: "Actions",
    render: (item) => (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleViewDetails(item._id)}
          className="px-5 py-2.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
        >
          View
        </button>

        {item.bookingStatus === "Booked" && (
          <button
            onClick={() => handleChatWithTechnician(item._id)}
            className="px-5 py-2.5 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-xs"
          >
            Chat
          </button>
        )}

        {(role === "user" || role === "technician") &&
          handleCancelBooking &&
          item.bookingStatus === "Booked" &&
          (() => {
            if (role === "technician") {
              const [day, month, year] = item.timeSlotId.date.split("-");
              const serviceDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              serviceDate.setHours(0, 0, 0, 0);

              return serviceDate > today;
            }

            return true;
          })() && (
            <button
              onClick={() => handleCancelBooking(item._id)}
              className="px-5 py-2.5 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-xs"
            >
              Cancel
            </button>
          )}

        {role === "technician" &&
          handleCompleteBooking &&
          item.bookingStatus === "Booked" &&
          (() => {
            const [day, month, year] = item.timeSlotId.date.split("-");
            const serviceDate = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return serviceDate <= today;
          })() && (
            <button
              onClick={() => handleCompleteBooking(item._id)}
              className="px-5 py-2.5 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors text-xs"
            >
              Complete
            </button>
          )}

        {/* Rating Button Logic - Show only if not rated and within 3 days */}
        {role === "user" &&
          handleRateService &&
          item.bookingStatus === "Completed" &&
          !item.isRated && // Hide if already rated
          (() => {
            const completedDate = new Date(item.updatedAt);
            const today = new Date();
            const daysDifference = Math.floor(
              (today.getTime() - completedDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return daysDifference <= 3;
          })() && (
            <button
              onClick={() => handleRateService(item._id)}
              className="px-5 py-2.5 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors text-xs"
            >
              Rate
            </button>
          )}
      </div>
    ),
  });

  return baseColumns;
};
