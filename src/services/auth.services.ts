import axiosInstance from "../config/axios.config";
import {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  OTPVerification,
  Role,
  tempRegisterResponse,
  UserLikeRoles,
  VerifyResetOtpResponse,
} from "../types/auth.types";

export const login = async (formData: LoginFormData, role: Role) => {
  const response = await axiosInstance.post<LoginResponse>(
    `/${role.toLowerCase()}/login`,
    {
      formData,
    },
  );
  return response.data;
};

export const register = async (
  formData: RegisterFormData,
  role: UserLikeRoles,
) => {
  const response = await axiosInstance.post<tempRegisterResponse>(
    `/${role.toLowerCase()}/register`,
    {
      formData,
    },
  );
  return response.data;
};

export const verifyOtp = async (
  data: OTPVerification,
  role: UserLikeRoles,
  purpose: "REGISTRATION" | "PASSWORD_RESET" = "REGISTRATION",
) => {
  const response = await axiosInstance.post<
    RegisterResponse | VerifyResetOtpResponse
  >(`/${role.toLowerCase()}/verifyotp`, { ...data, purpose });
  return response.data;
};

export const resendOtp = async (email: string, role: UserLikeRoles) => {
  const response = await axiosInstance.post(
    `/${role.toLowerCase()}/resendotp`,
    { email },
  );
  return response.data;
};

export const forgotPassword = async (email: string, role: UserLikeRoles) => {
  const response = await axiosInstance.post(
    `/${role.toLowerCase()}/forgotpassword`,
    { email },
  );
  return response.data;
};

export const resetPassword = async (
  email: string,
  password: string,
  role: UserLikeRoles,
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    `/${role.toLowerCase()}/resetpassword`,
    { email, password },
  );
  return response.data;
};
