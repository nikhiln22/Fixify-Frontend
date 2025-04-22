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


export type RegisterResponse = UserRegisterResponse | TechnicianRegisterResponse;


export interface BaseTempRegisterResponse {
  success: boolean;
  email: string;
  message: string;
}


export interface UserTempRegisterResponse extends BaseTempRegisterResponse {
  tempUserId: string;
}


export interface TechnicianTempRegisterResponse extends BaseTempRegisterResponse {
  tempTechnicianId: string;
}


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