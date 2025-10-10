export interface AddPartsPayload {
  parts: Array<{
    partId: string;
    quantity: number;
  }>;
  totalPartsAmount: number;
}
