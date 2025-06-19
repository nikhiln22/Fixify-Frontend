export interface IBooking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  addressId: string;
  timeSlotId: string;
  totalAmount: number;
  bookingStatus: "Pending" | "Booked" | "Cancelled" | "Completed";
  paymentStatus?: "Paid" | "Refunded"
  createdAt: Date;
  updatedAt: Date;
}
