export interface ITimeSlot {
  _id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
