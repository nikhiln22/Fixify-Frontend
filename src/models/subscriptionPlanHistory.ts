export interface ISubscriptionPlanHistory {
  _id: string;
  technicianId: {
    _id: string;
    username: string;
  };
  subscriptionPlanId: {
    _id: string;
    planName: string;
    durationInMonths: number;
    commissionRate: number;
  };
  amount: number;
  status: "Active" | "Expired";
  paymentId?: string;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
