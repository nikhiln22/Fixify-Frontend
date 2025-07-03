export interface IWalletTransaction {
  _id: string;
  ownerId: string;
  walletId: string;
  ownerType: "user" | "technician";
  type: "Credit" | "Debit";
  description: string;
  amount: number;
  referenceId?: string;
  createdAt: Date;
}
