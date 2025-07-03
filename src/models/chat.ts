export interface IChat {
  _id: string;
  bookingId: string;
  userId: string;
  technicianId: string;
  messageText: string;
  senderType: "user" | "technician";
  createdAt: Date;
  updatedAt: Date;
}
