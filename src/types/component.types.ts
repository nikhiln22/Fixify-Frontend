import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
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
}

export interface OTPInputProps {
  length: number;
  value: string;
  onchange: (otp: string) => void;
}

export interface Column<T> {
  key: keyof T | "action";
  label: string;
  render?: (item: T) => React.ReactNode;
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
