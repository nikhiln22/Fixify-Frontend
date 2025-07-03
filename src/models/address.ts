export interface IAddress {
  _id: string;
  userId?: string;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber?: string;
  longitude?: number;
  latitude?: number;
  landmark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
