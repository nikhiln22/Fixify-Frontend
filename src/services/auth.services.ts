import axiosInstance from "../config/axios.config";
import Cookies from "js-cookie";
import { envConfig } from "../config/env.config";
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

const getAuthUrl = (role: UserLikeRoles | Role, endpoint: string) =>
  `/${role.toLowerCase()}/${endpoint}`;

const refreshToken = async (role: Role) => {
  try {
    const response = await axiosInstance.post(
      `${envConfig.apiUrl}/refreshtoken`,
      { role: role.toLowerCase() },
      { withCredentials: true }
    );

    if (response.data.success) {
      const newAccessToken = response.data.access_token;

      Cookies.set(`${role.toLowerCase()}_access_token`, newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const role = error.config.headers["role"] || "USER";

      try {
        const newAccessToken = await refreshToken(role);

        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Could not refresh token, logging out...");
        Cookies.remove(`${role.toLowerCase()}_access_token`);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

const login = async (formData: LoginFormData, role: Role) => {
  const response = await axiosInstance.post<LoginResponse>(
    getAuthUrl(role, "login"),
    formData,
    { withCredentials: true }
  );
  return response.data;
};

const register = async (formData: RegisterFormData, role: UserLikeRoles) => {
  const response = await axiosInstance.post<TempRegisterResponse>(
    getAuthUrl(role, "register"),
    formData
  );
  return response.data;
};

const verifyOtp = async (
  data: OTPVerification,
  role: UserLikeRoles,
  purpose: "REGISTRATION" | "PASSWORD_RESET" = "REGISTRATION"
) => {
  let payload;
  if (role.toLowerCase() === "technician") {
    payload = { ...data, purpose };
  } else {
    payload = { ...data, purpose };
  }

  const response = await axiosInstance.post<
    RegisterResponse | VerifyResetOtpResponse
  >(getAuthUrl(role, "verifyotp"), payload);

  return response.data;
};

const resendOtp = async (email: string, role: UserLikeRoles) => {
  const response = await axiosInstance.post(getAuthUrl(role, "resendotp"), {
    email,
  });
  return response.data;
};

const forgotPassword = async (email: string, role: UserLikeRoles) => {
  const response = await axiosInstance.post(
    getAuthUrl(role, "forgotpassword"),
    { email }
  );
  return response.data;
};

const resetPassword = async (
  email: string,
  password: string,
  role: UserLikeRoles
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(getAuthUrl(role, "resetpassword"), {
    email,
    password,
  });
  return response.data;
};

const logOut = async (role: Role) => {
  const accessToken = Cookies.get(`${role.toLowerCase()}_access_token`);

  const response = await axiosInstance.get(getAuthUrl(role, "logout"), {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const authService = {
  login,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logOut,
};

export default authService;
