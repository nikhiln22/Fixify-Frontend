export interface IChat {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    username: string;
  };
  technicianId: {
    _id: string;
    username: string;
    image: string;
  };
  messageText: string;
  senderType: "user" | "technician";
  createdAt: Date;
  updatedAt: Date;
}
