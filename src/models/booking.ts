
export interface IBooking {
  _id: string;
  userId: string;
  technicianId: string;
  serviceId: string;
  addressId: string;
  timeSlotId: string;
  date: string;
  totalAmount: number;
  paymentMethod: "Cash" | "online" | "Wallet";
  bookingStatus: "Pending" | "cancelled" | "completed";
  paymentStatus: "Pending" | "success" | "Failed";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
