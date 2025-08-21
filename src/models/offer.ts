export interface IOffer {
  _id: string;
  title: string;
  description: string;
  offer_type: "global" | "service_category" | "first_time_user";
  discount_type: "percentage" | "flat_amount";
  discount_value: number;
  max_discount?: number;
  min_booking_amount?: number;
  serviceId?: string;
  status?: string;
  valid_until?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
