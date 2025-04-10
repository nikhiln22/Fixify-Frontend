import { Iuser } from "../models/user";

export type Role = "USER" | "ADMIN" | "TECHNICIAN";

export type UserLikeRoles = Extract<Role, "USER" | "TECHNICIAN">;

export interface LoginProps {
  role: Role;
}

export interface OtpProps {
  role: UserLikeRoles;
}

export interface RegisterProps {
  role: UserLikeRoles;
}

export interface ForgotPasswordProps {
  role: UserLikeRoles;
}

export interface ForgotPasswordLinkProps {
  role: UserLikeRoles;
}

export interface ResetPasswordProps {
  role: UserLikeRoles;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: Iuser;
  role: string;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface OTPVerification {
  tempUserId?: string;
  email?: string;
  otp: string;
  purpose?:"REGISTRATION" | "Password_RESET"
}

export interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  userData?: Iuser;
  message: string;
  access_token: string;
  refresh_token: string;
  status: number;
}

export interface tempRegisterResponse {
  success: boolean;
  email: string;
  message: string;
  tempUserId: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface VerifyResetOtpResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  status: number;
}
