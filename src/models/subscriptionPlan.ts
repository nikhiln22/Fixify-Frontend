export interface ISubscriptionPlan {
  _id: string;
  planName: "BASIC" | "PRO" | "ELITE";
  monthlyPrice: number;
  commissionRate: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
