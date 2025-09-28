export interface CreateSubscriptionPlanDto {
  planName: string;
  price: number;
  commissionRate: number;
  WalletCreditDelay: number;
  profileBoost: boolean;
  durationInMonths: number;
  description: string;
}

export interface UpdateSubscriptionPlanDto {
  planName?: string;
  price?: number;
  commissionRate?: number;
  WalletCreditDelay?: number;
  profileBoost?: boolean;
  durationInMonths?: number;
  description?: string;
}

export interface SubscriptionPlanFormDto {
  _id?: string;
  planName: string;
  price: number;
  commissionRate: number;
  WalletCreditDelay: number;
  profileBoost: string;
  durationInMonths: number;
  description: string;
}
