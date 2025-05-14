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
    purpose: OtpPurpose,
    tempId?: string,
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
  data: Iadmin | Iuser | Itechnician;
  message: string;
  status?: number;
}

export interface BaseOTPVerification {
  email?: string;
  otp: string;
  purpose?: OtpPurpose;
}

export interface UserOTPVerification extends BaseOTPVerification {
  tempUserId?: string;
}

export interface TechnicianOTPVerification extends BaseOTPVerification {
  tempTechnicianId?: string;
}

export type OTPVerification = UserOTPVerification | TechnicianOTPVerification;

export interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UserRegisterResponse {
  success: boolean;
  userData?: Iuser;
  message: string;
  access_token: string;
  refresh_token: string;
  status: number;
}

export interface TechnicianRegisterResponse {
  success: boolean;
  technicianData?: Itechnician;
  message: string;
  access_token: string;
  refresh_token: string;
  status: number;
}

export type RegisterResponse =
  | UserRegisterResponse
  | TechnicianRegisterResponse;

export interface BaseTempRegisterResponse {
  success: boolean;
  email: string;
  message: string;
}

export interface UserTempRegisterResponse extends BaseTempRegisterResponse {
  tempUserId: string;
}

export interface TechnicianTempRegisterResponse
  extends BaseTempRegisterResponse {
  tempTechnicianId: string;
}

export type TempRegisterResponse =
  | UserTempRegisterResponse
  | TechnicianTempRegisterResponse;

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

export function isUserOTPVerification(
  payload: OTPVerification,
): payload is UserOTPVerification {
  return "tempUserId" in payload;
}

export function isTechnicianOTPVerification(
  payload: OTPVerification,
): payload is TechnicianOTPVerification {
  return "tempTechnicianId" in payload;
}
