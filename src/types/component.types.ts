import React, { ButtonHTMLAttributes } from "react";
import { Role } from "./auth.types";
import { IAddress } from "../models/address";
import { ITimeSlot } from "../models/timeslot";
import { TimeSlotData } from "./technicians.types";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  isLoading?: boolean;
  onClick?: () => void;
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
  loading?: boolean;
  pageSize?: number;
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
}

export interface VerificationBannerProps {
  isVerified: boolean;
  isSubmitted?: boolean;
  onStartVerification: () => void;
}

export interface SelectFieldProps {
  label: string;
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
    servicePrice?: string | number;
    description?: string;
    serviceImage?: File | string | null;
    categoryId?: string;
    designationId: string;
  };
  isEditing?: boolean;
}

export interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  height?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface CardProps {
  image?: string;
  title?: string;
  price?: number;
  rating?: number;
  reviews?: string;
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

export interface TimeSlotDisplayProps {
  timeSlots: ITimeSlot[];
}

export interface TimeSlotFormProps {
  onSubmit: (data: TimeSlotData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface PrivateRouteProps {
  role: Role;
}

export interface PublicRouteProps {
  role: Role;
  redirectTo: string;
}
