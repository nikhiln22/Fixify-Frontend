import React, { ButtonHTMLAttributes } from "react";
import { Role } from "./auth.types";
import { IAddress } from "../models/address";
import { ITimeSlot } from "../models/timeslot";
import { ITimeSlotData } from "./technicians.types";
import { ICoupon } from "../models/coupon";
import { OfferData } from "./user.types";
import { CouponData } from "./user.types";
import { IOffer } from "../models/offer";
import { IService } from "../models/service";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  isLoading?: boolean;
}

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showToggle?: boolean;
  error?: string;
  touched?: boolean;
}

export interface AuthLayoutProps {
  role: "USER" | "ADMIN" | "TECHNICIAN";
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmButtonColor?: "red" | "green" | "blue";
  fullContent?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface OTPInputProps {
  length: number;
  value: string;
  onchange: (otp: string) => void;
}

export interface Column<T> {
  key: keyof T | "action";
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  pageSize: number;
  loading?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ToastMessageProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface AddDesignationFormProps {
  onCancel?: () => void;
  onSubmit?: (designation: string) => Promise<void>;
  isLoading?: boolean;
}

export interface QualificationFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  designationOptions: { value: string; label: string }[];
  designationsLoading: boolean;
}

export interface VerificationBannerProps {
  isVerified: boolean;
  isSubmitted?: boolean;
  onStartVerification: () => void;
}

export interface SelectFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface AddCategoryProps {
  onCancel?: () => void;
  onSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  initialValues?: {
    _id?: string;
    categoryName: string;
    categoryImage: File | string | null;
  };
  isEditing?: boolean;
}

export interface AddServiceProps {
  onCancel?: () => void;
  onSubmit?: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  initialValues?: {
    _id?: string;
    serviceName?: string;
    serviceType: "fixed" | "hourly";
    servicePrice?: number;
    description?: string;
    hourlyRate?: number;
    estimatedTime?: number;
    maxHours?: number;
    serviceImage?: File | string | null;
    categoryId?: string;
    designationId?: string;
  };
  isEditing?: boolean;
  categoryOptions: { value: string; label: string }[];
  designationOptions: { value: string; label: string }[];
}

export interface BannerProps {
  className?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  height?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayColor?: string;
}

export interface CardProps {
  image?: string;
  title?: string;
  price?: number;
  serviceType?: string;
  estimatedTime?: number;
  hourlyRate?: number;
  type: "category" | "service";
  onClick?: () => void;
  buttonLabel?: string;
}

export interface TechnicianProfileCardProps {
  name: string;
  email: string;
  phone: number;
  Designation?: string;
  yearsOfExperience?: number;
  profilePhoto?: string | null;
}

export interface AddressCardProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onDelete?: (id: string) => void;
}

export interface ProfileData {
  name?: string;
  phone?: number;
  image?: string;
  Designation?: string;
  yearsOfExperience?: number;
}

export interface ProfileCardProps {
  name: string;
  email: string;
  phone: number;
  image?: string;
  role: "user" | "technician";
  Designation?: string;
  yearsOfExperience?: number;
  isEditable?: boolean;
  onSave?: (formData: FormData) => void | Promise<void>;
}

export interface AddressFormProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: IAddress;
  onSave: (address: Partial<IAddress>) => void;
  onClose: () => void;
}

export interface AddressManagerProps {
  userId?: string;
  addresses?: IAddress[];
  onAddressChange: (addresses: IAddress[]) => void;
  onAddressSave: (addressData: Partial<IAddress>) => Promise<IAddress | void>;
  onAddressDelete: (addressId: string) => Promise<void>;
}

export interface AddMoneyFormProps {
  onCancel: () => void;
  onSubmit: (amount: number) => void;
  isLoading?: boolean;
}

export interface TimeSlotDisplayProps {
  timeSlots: ITimeSlot[];
}

export interface TimeSlotFormProps {
  onSubmit: (data: ITimeSlotData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type PaymentMethod = "Online" | "Wallet";

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface PaymentMethodSelectorProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

export interface BookingSummaryProps {
  service: IService;
  offerData?: OfferData | null;
  isLoadingOffer?: boolean;
  isLoadingCoupons?: boolean;
  onFetchCoupons: () => void;
  appliedCoupon?: {
    code: string;
    couponId: string;
    discountAmount: number;
    finalAmount: number;
  } | null;
  onRemoveCoupon?: () => void;
  onConfirmBooking: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  selectedPaymentMethod?: PaymentMethod | null;
}

export interface WalletBalanceProps {
  balance: number;
  loading?: boolean;
  error?: string | null;
  onAddMoney?: (amount: number) => void;
  showAddMoney?: boolean;
}

export interface AddOfferProps {
  onCancel?: () => void;
  onSubmit?: (data: Partial<IOffer>) => Promise<void>;
  isLoading?: boolean;
  initialValues?: {
    _id?: string;
    title: string;
    description: string;
    offer_type: "global" | "service_category" | "first_time_user";
    discount_type: "percentage" | "flat_amount";
    discount_value: string | number;
    max_discount?: string | number;
    min_booking_amount?: string | number;
    serviceId?: string;
    valid_until: string;
  };
  isEditing?: boolean;
  serviceOptions?: { value: string; label: string }[];
  isFetchingServices?: boolean;
  serviceError?: string | null;
}

export interface AddCouponProps {
  onCancel?: () => void;
  onSubmit?: (data: Partial<ICoupon>) => Promise<void>;
  isLoading?: boolean;
  initialValues?: {
    _id?: string;
    code: string;
    title: string;
    description: string;
    discount_type: "percentage" | "flat_amount";
    discount_value: number | string;
    max_discount?: string | number;
    min_booking_amount?: number | string;
    valid_until?: string;
  };
  isEditing?: boolean;
}

export interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: CouponData[];
  onApplyCoupon: (
    newCoupon: CouponData,
    currentCoupon?: CouponData | null
  ) => void;
  appliedCoupon: CouponData | null;
}

export interface AddPartProps {
  onCancel: () => void;
  onSubmit?: (data: AddPartFormData) => Promise<void>;
  isLoading?: boolean;
  initialValues?: AddPartFormData;
  isEditing?: boolean;
  serviceOptions?: Array<{ value: string; label: string }>;
}

export interface AddPartFormData {
  name: string;
  description: string;
  price: string;
  services: string[];
}

export interface PrivateRouteProps {
  role: Role;
}

export interface PublicRouteProps {
  role: Role;
  redirectTo: string;
}
