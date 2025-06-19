export interface IWalletTransaction {
  _id: string;
  userId: string;
  walletId: string;
  type: "Credit" | "Debit";
  description: string;
  amount: number;
  referenceId?: string;
  createdAt: Date;
}
