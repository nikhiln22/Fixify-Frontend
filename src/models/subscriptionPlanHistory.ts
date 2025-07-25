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
  };
  amount: number;
  status: "Active" | "Expired";
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
