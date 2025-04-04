import { Iuser } from "../models/user";

export type Role = "USER" | "ADMIN" | "TECHNICIAN";

export interface LoginProps {
  role: Role;
}

export interface RegisterProps {
  role: Extract<Role, "USER" | "TECHNICIAN">;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: Iuser;
  accessToken: string;
  refreshToken: string;
}

export interface OTPVerification {
  tempUserId: string;
  email?: string;
  otp: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  user: Iuser;
}

export interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  yearsOfExperience?: string;
  role?: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: Iuser;
  message: string;
  access_token?: string;
  refresh_token?: string;
  status: number;
}

export interface tempRegisterResponse {
  success: boolean;
  email: string;
  message: string;
  tempUserId: string;
}
