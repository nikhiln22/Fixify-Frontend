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
    yearsOfExperience: number;
    Designation: {
      _id: string;
      designation: string;
    };
  };
  serviceId: {
    _id: string;
    name: string;
    description: string;
    serviceType: "fixed" | "hourly";
    price: number;
    bookingAmount: number;
    hourlyRate: number;
    image: string;
    category: {
      _id: string;
      name: string;
    };
    designation: {
      _id: string;
      designation: string;
    };
    status: string;
    estimatedTime?: number;
    maxHours?: number;
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
  serviceStartTime: Date;
  serviceEndTime: Date;
  actualDuration: Date;
  bookingAmount: number;
  bookingStatus:
    | "Pending"
    | "Booked"
    | "In Progress"
    | "Payment Pending"
    | "Cancelled"
    | "Completed";
  paymentId: {
    _id: string;
    paymentStatus: "Partial Paid" | "Paid" | "Refunded";
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
    advanceAmount?: number;
  };
  cancellationDate?: Date;
  cancellationReason?: string;
  isRated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
