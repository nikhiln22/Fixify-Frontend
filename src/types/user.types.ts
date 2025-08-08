import { Iuser } from "../models/user";
import { IAddress } from "../models/address";
import { IBooking } from "../models/booking";

export interface UserProfileResponse {
  message: string;
  success: boolean;
  status: number;
  data?: Iuser;
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
  originalAmount?: number;
  bookingAmount: number;
  offerId: string;
  couponId: string;
  paymentMethod: "Online" | "Wallet";
}

export interface BookServiceResponse {
  success: boolean;
  message: string;
  data?: IBooking & {
    checkoutUrl?: string;
    stripeCheckoutSessionId?: string;
    requiresPayment?: boolean;
  };
  status?: number;
}

export interface BookingDetailsResponse {
  success: boolean;
  message: string;
  data?: IBooking;
  status?: number;
}

export interface OfferData {
  offerId?: string;
  offerApplied: boolean;
  offerName: string;
  discountAmount: number;
  finalAmount: number;
  discountValue: number;
  maxDiscount?: number;
  minBookingAmount?: number;
  discountType: string;
  offerType: string;
}

export interface CouponData {
  code: string;
  title: string;
  discountValue: number;
  serviceId?: string;
  discountType: "percentage" | "flat_amount";
  maxDiscount?: number;
  discountAmount: number;
  finalAmount: number;
  couponId: string;
}
