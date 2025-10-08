import { IBooking } from "../../models/booking";
import { Column } from "../../types/component.types";

export const getBookingsColumns = (
  handleViewDetails: (id: string) => void,
  role: "user" | "technician" | "admin",
  handleCompleteBooking?: (id: string) => void,
  handleCancelBooking?: (id: string) => void,
  handleChatWithTechnician?: (id: string) => void,
  handleRateService?: (id: string) => void,
  handleStartService?: (id: string) => void // ✅ added
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
      render: (item) => {
        const firstTimeSlot =
          Array.isArray(item.timeSlotId) && item.timeSlotId.length > 0
            ? item.timeSlotId[0]
            : null;

        return (
          <div className="text-center font-medium">
            {firstTimeSlot?.date || "N/A"}
          </div>
        );
      },
    });

    baseColumns.push({
      key: "timeSlotId",
      label: "Service Time",
      render: (item) => {
        const firstTimeSlot =
          Array.isArray(item.timeSlotId) && item.timeSlotId.length > 0
            ? item.timeSlotId[0]
            : null;

        return (
          <div className="text-center font-medium">
            {firstTimeSlot?.startTime || "N/A"}
          </div>
        );
      },
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
          ? item.paymentId?.technicianShare || 0
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
                    : item.bookingStatus === "In Progress"
                      ? "bg-orange-100 text-orange-800"
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
      render: (item) => {
        const paymentStatus = item.paymentId?.paymentStatus || "Pending";

        return (
          <div className="flex justify-center">
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                paymentStatus === "Paid"
                  ? "bg-green-100 text-green-800"
                  : paymentStatus === "Refunded"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        );
      },
    });
  }

  baseColumns.push({
    key: "action",
    label: "Actions",
    render: (item) => {
      const firstTimeSlot =
        Array.isArray(item.timeSlotId) && item.timeSlotId.length > 0
          ? item.timeSlotId[0]
          : null;

      return (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleViewDetails(item._id)}
            className="px-5 py-2.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
          >
            View
          </button>

          {item.bookingStatus === "Booked" && role !== "admin" && (
            <button
              onClick={() => handleChatWithTechnician?.(item._id)}
              className="px-5 py-2.5 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-xs"
            >
              Chat
            </button>
          )}

          {(role === "user" || role === "technician") &&
            handleCancelBooking &&
            item.bookingStatus === "Booked" &&
            (() => {
              if (role === "technician" && firstTimeSlot?.date) {
                const [day, month, year] = firstTimeSlot.date.split("-");
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

              return role === "user";
            })() && (
              <button
                onClick={() => handleCancelBooking(item._id)}
                className="px-5 py-2.5 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-xs"
              >
                Cancel
              </button>
            )}

          {role === "technician" &&
            handleStartService &&
            item.bookingStatus === "Booked" &&
            firstTimeSlot?.date &&
            (() => {
              const [day, month, year] = firstTimeSlot.date.split("-");
              const serviceDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return serviceDate.getTime() === today.getTime();
            })() && (
              <button
                onClick={() => handleStartService(item._id)}
                className="px-5 py-2.5 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition-colors text-xs"
              >
                Start Service
              </button>
            )}

          {role === "technician" &&
            handleCompleteBooking &&
            item.bookingStatus === "Booked" &&
            firstTimeSlot?.date &&
            (() => {
              const [day, month, year] = firstTimeSlot.date.split("-");
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

          {role === "user" &&
            handleRateService &&
            item.bookingStatus === "Completed" &&
            !item.isRated &&
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
      );
    },
  });

  return baseColumns;
};
