export interface IBooking {
  _id: string;
  userId: {
    _id: string;
    username: string;
    phone: string;
    email: string;
  };
  technicianId: {
    _id: string;
    username: string;
    phone: number;
    email: string;
    image: string;
    is_verified: boolean;
    yearsOfExperience: Number;
    Designation: {
      _id: string;
      designation: string;
    };
  };
  serviceId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    bookingAmount: number;
    image: string;
  };
  addressId: {
    _id: string;
    addressType: string;
    fullAddress: string;
    houseNumber: string;
    landmark: string;
  };
  timeSlotId: {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  bookingAmount: number;
  bookingStatus: "Pending" | "Booked" | "Cancelled" | "Completed";
  paymentId: {
    _id: string;
    paymentStatus: "Paid" | "Refunded";
    paymentMethod?: "Online" | "Wallet";
    originalAmount?: number;
    amountPaid?: number;
    fixifyShare?: number;
    technicianShare?: number;
    technicianPaid?: boolean;
    technicianPaidAt?: Date;
    refundStatus?: "Not Refunded" | "Refunded";
    refundDate?: Date;
    refundAmount?: number;
    creditReleaseDate?: Date;
  };
  cancellationDate?: Date;
  cancellationReason?: string;
  isRated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
