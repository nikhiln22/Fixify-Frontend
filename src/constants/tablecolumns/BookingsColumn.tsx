import { IBooking } from "../../models/booking";
import { Column } from "../../types/component.types";

export const getBookingsColumns = (
  handleViewDetails: (id: string) => void
): Column<IBooking>[] => [
  {
    key: "_id",
    label: "Booking ID",
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
        {typeof item.serviceId === 'object' && item.serviceId?.name 
          ? item.serviceId.name 
          : "Service Name"}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Booking Date",
    render: (item) => (
      <div className="text-center">
        <div className="font-medium">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    ),
  },
  {
    key: "totalAmount",
    label: "Amount Paid",
    render: (item) => (
      <div className="text-center font-medium">₹{item.totalAmount}</div>
    ),
  },
  {
    key: "bookingStatus",
    label: "Booking Status",
    render: (item) => (
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
  },
  // {
  //   key: "paymentStatus",
  //   label: "Payment Status",
  //   render: (item) => (
  //     <div className="flex justify-center">
  //       <span
  //         className={`px-2 py-1 rounded-full text-xs font-medium ${
  //           item.paymentStatus === "Pending"
  //             ? "bg-yellow-100 text-yellow-800"
  //             : item.paymentStatus === "success"
  //               ? "bg-green-100 text-green-800"
  //               : item.paymentStatus === "Failed"
  //                 ? "bg-red-100 text-red-800"
  //                 : "bg-blue-100 text-blue-800"
  //         }`}
  //       >
  //         {item.paymentStatus}
  //       </span>
  //     </div>
  //   ),
  // },
  {
    key: "action",
    label: "Action",
    render: (item) => (
      <div className="flex justify-center">
        <button
          onClick={() => handleViewDetails(item._id)}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          View
        </button>
      </div>
    ),
  },
];