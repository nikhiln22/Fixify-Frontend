import { Iuser } from "./Models/user";


export interface LoginFormData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: Iuser;
    accessToken: string;
    refreshToken:string
}

export interface OTPVerification {
    tempUserId:string;
    email?: string;
    otp: string;
}

export interface OTPRequest {
    email: string;
}

export interface OTPResponse {
    success: boolean;
    message: string;
    user:Iuser;
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
    data?: Iuser;
    message: string;
    access_token?: string
    refresh_token?: string
    status: number
}

export interface tempRegisterResponse {
    success: boolean;
    email: string;
    message: string;
    tempUserId: string;
}
