import axiosInstance from "../config/axios.config";
import {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  OTPVerification,
  Role,
  TempRegisterResponse,
  UserLikeRoles,
  VerifyResetOtpResponse,
} from "../types/auth.types";

export const login = async (formData: LoginFormData, role: Role) => {
  const response = await axiosInstance.post<LoginResponse>(
    `/${role.toLowerCase()}/login`,
    formData,
  );
  return response.data;
};

export const register = async (
  formData: RegisterFormData,
  role: UserLikeRoles,
) => {
  const response = await axiosInstance.post<TempRegisterResponse>(
    `/${role.toLowerCase()}/register`,
    {
      ...formData,
    },
  );
  return response.data;
};

export const verifyOtp = async (
  data: OTPVerification,
  role: UserLikeRoles,
  purpose: "REGISTRATION" | "PASSWORD_RESET" = "REGISTRATION",
) => {

  console.log(`veryfying the otp for ${role} with purpose ${purpose}`);

  console.log("payload:",data);

  let payload;
  if (role.toLowerCase() === "technician") {
    if (!('tempTechnicianId' in data) && purpose === "REGISTRATION") {
      console.error("Missing tempTechnicianId for technician OTP verification");
    }
    payload = { ...data, purpose };
  } else {
    if (!('tempUserId' in data) && purpose === "REGISTRATION") {
      console.error("Missing tempUserId for user OTP verification");
    }
    payload = { ...data, purpose };
  }

  const response = await axiosInstance.post<
    RegisterResponse | VerifyResetOtpResponse
  >(`/${role.toLowerCase()}/verifyotp`, payload);
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
