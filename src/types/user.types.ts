import { Iuser } from "../models/user";
import { IAddress } from "../models/address";
import { IBooking } from "../models/booking";

export interface UserProfileResponse {
  message: string;
  success: boolean;
  status: number;
  user?: Iuser;
}

export interface getAddressResponse {
  success: boolean;
  message: string;
  status: number;
  data: IAddress[];
}

export interface AddAddressData {
  addressType?: "Home" | "Work";
  fullAddress: string;
  houseNumber?: string;
  longitude: number;
  latitude: number;
  landmark?: string;
}

export interface AddAddressResponse {
  success: boolean;
  message: string;
  status: number;
  data?: IAddress;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  status: number;
  data?: IAddress;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface CreateBookingRequest {
  technicianId: string;
  serviceId: string;
  addressId: string;
  timeSlotId: string;
  date: string;
  totalAmount: number;
  paymentMethod: "Cash" | "online" | "Wallet";
}


export interface BookServiceResponse {
  success: boolean;
  message: string;
  data?: IBooking;
  error?: string;
}
