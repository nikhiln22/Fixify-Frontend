import React, { ButtonHTMLAttributes } from "react";

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

export interface LoaderProps {
  size?: "SMALL" | "MEDIUM" | "LARGE";
  color?: string;
}

export interface ModalProps {
  isopen: boolean;
  onclose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmButtonColor?: "red" | "green" | "blue";
  fullContent?: boolean;
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

export interface TableWithPaginationProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export interface ToastMessageProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface AddDesignationFormProps {
  onSuccess: () => void;
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

export interface VerificationBannerProps {
  isVerified: boolean;
  isSubmitted?: boolean;
  onStartVerification: () => void;
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
  };
  isEditing?: boolean;
}