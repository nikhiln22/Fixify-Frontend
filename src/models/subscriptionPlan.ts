export interface ISubscriptionPlan {
  _id: string;
  planName: string;
  price: number;
  commissionRate: number;
  WalletCreditDelay: number;
  profileBoost: boolean;
  durationInMonths: number;
  description: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
