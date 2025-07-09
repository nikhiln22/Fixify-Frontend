export interface ICoupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  discount_type: "percentage" | "flat_amount";
  discount_value: number;
  max_discount?: number;
  min_booking_amount?: number;
  used_by_users?: string;
  valid_until?: Date;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
