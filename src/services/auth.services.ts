import axios from "axios";
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

const API_URL = "http://localhost:3000";

export const login = async (formData: LoginFormData, role: Role) => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/${role.toLowerCase()}/login`,
    {
      ...formData,
    }
  );
  return response.data;
};

export const register = async (
  formData: RegisterFormData,
  role: UserLikeRoles
) => {
  const response = await axios.post<tempRegisterResponse>(
    `${API_URL}/${role.toLowerCase()}/register`,
    {
      ...formData,
    }
  );
  return response.data;
};

export const verifyOtp = async (
  data: OTPVerification,
  role: UserLikeRoles,
  purpose: "REGISTRATION" | "PASSWORD_RESET" = "REGISTRATION"
) => {
  const response = await axios.post<RegisterResponse | VerifyResetOtpResponse>(
    `${API_URL}/${role.toLowerCase()}/verifyotp`,
    { ...data, purpose }
  );
  return response.data;
};

export const resendOtp = async (email: string, role: UserLikeRoles) => {
  const response = await axios.post(
    `${API_URL}/${role.toLowerCase()}/resendotp`,
    { email }
  );
  return response.data;
};

export const forgotPassword = async (email: string, role: UserLikeRoles) => {
  const response = await axios.post(
    `${API_URL}/${role.toLowerCase()}/forgotpassword`,
    { email }
  );
  return response.data;
};

export const resetPassword = async (
  email: string,
  password: string,
  role: UserLikeRoles
): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_URL}/${role.toLowerCase()}/resetpassword`,
    { email, password }
  );
  return response.data;
};
