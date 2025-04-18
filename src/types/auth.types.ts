import { Iuser } from "../models/user";
import { Itechnician } from "../models/technician";
import { Iadmin } from "../models/admin";

export type Role = "USER" | "ADMIN" | "TECHNICIAN";

export type UserLikeRoles = Extract<Role, "USER" | "TECHNICIAN">;

export interface GenericEntity {
  [key: string]: any;
}

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
  data: Iadmin | Iuser | Itechnician;
  message: string;
  access_Token: string;
  refresh_Token: string;
  status?: number;
}

export interface BaseOTPVerification {
  email?: string;
  otp: string;
  purpose?: "REGISTRATION" | "PASSWORD_RESET";
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

// User registration response
export interface UserRegisterResponse {
  success: boolean;
  userData?: Iuser;
  message: string;
  access_token: string;
  refresh_token: string;
  status: number;
}

// Technician registration response
export interface TechnicianRegisterResponse {
  success: boolean;
  technicianData?: Itechnician;
  message: string;
  access_token: string;
  refresh_token: string;
  status: number;
}

// Combined registration response type
export type RegisterResponse = UserRegisterResponse | TechnicianRegisterResponse;

// Base temporary registration response with common fields
export interface BaseTempRegisterResponse {
  success: boolean;
  email: string;
  message: string;
}

// User-specific temporary registration response
export interface UserTempRegisterResponse extends BaseTempRegisterResponse {
  tempUserId: string;
}

// Technician-specific temporary registration response
export interface TechnicianTempRegisterResponse extends BaseTempRegisterResponse {
  tempTechnicianId: string;
}

// Dynamic temporary registration response based on role
export type TempRegisterResponse = UserTempRegisterResponse | TechnicianTempRegisterResponse;


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

// Helper type guard functions to determine which type of response/payload we're dealing with
export function isUserTempRegisterResponse(response: TempRegisterResponse): response is UserTempRegisterResponse {
  return 'tempUserId' in response;
}

export function isTechnicianTempRegisterResponse(response: TempRegisterResponse): response is TechnicianTempRegisterResponse {
  return 'tempTechnicianId' in response;
}

export function isUserOTPVerification(payload: OTPVerification): payload is UserOTPVerification {
  return 'tempUserId' in payload;
}

export function isTechnicianOTPVerification(payload: OTPVerification): payload is TechnicianOTPVerification {
  return 'tempTechnicianId' in payload;
}