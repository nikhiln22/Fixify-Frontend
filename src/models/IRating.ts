export interface IRating {
  _id: string;
  userId: {
    _id: string;
    username: string;
    image?: string;
  };
  technicianId: string;
  bookingId: string;
  rating: number;
  review: string;
  ratingStatus: string;
  createdAt: string;
}
