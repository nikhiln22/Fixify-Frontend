import { Iuser } from "../models/user";
import { Itechnician } from "../models/technician";
import { Iadmin } from "../models/admin";

export type Role = "USER" | "ADMIN" | "TECHNICIAN";
export type UserLikeRoles = Extract<Role, "USER" | "TECHNICIAN">;
export type OtpPurpose = "REGISTRATION" | "PASSWORD_RESET";

export interface GenericEntity {
  [key: string]: any;
}

export interface LoginProps {
  role: Role;
  onsubmit: (values: LoginFormData) => Promise<void>;
}

export interface OtpProps {
  role: UserLikeRoles;
  onVerifyOtp: (
    values: { otp: string },
    email: string,
    purpose: OtpPurpose
  ) => Promise<void>;
  onResendOtp: (email: string) => Promise<void>;
}

export interface RegisterProps {
  role: UserLikeRoles;
  onSubmit: (values: RegisterFormData) => Promise<void>;
}

export interface ForgotPasswordProps {
  role: UserLikeRoles;
  onSubmit: (email: string) => Promise<void>;
}

export interface ForgotPasswordLinkProps {
  role: UserLikeRoles;
}

export interface ResetPasswordProps {
  role: UserLikeRoles;
  onSubmit: (password: string) => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    admin: Iadmin;
    user: Iuser;
    technician: Itechnician;
    access_token: string;
  };
  message: string;
  status?: number;
}

export interface OTPVerification {
  email: string;
  otp: string;
  purpose: OtpPurpose;
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
  data?: {
    email: string;
  };
  message: string;
  status: number;
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
