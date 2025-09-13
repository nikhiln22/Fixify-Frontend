export interface IAddress {
  _id: string;
  ownerId: string;
  ownerModel: "user" | "technician";
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber?: string;
  longitude?: number;
  latitude?: number;
  landmark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
