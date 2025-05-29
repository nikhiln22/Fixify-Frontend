import axiosInstance from "../config/axios.config";
import axios from "axios";
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
  `/api/${role.toLowerCase()}/${endpoint}`;

let isRefreshing = false;
let pendingRequests: ((token: string | null) => void)[] = [];

const getRoleFromUrl = (url: string): Role => {
  if (url.includes("/api/technician/")) {
    return "TECHNICIAN";
  } else if (url.includes("/api/admin/")) {
    return "ADMIN";
  } else {
    return "USER";
  }
};

export const refreshToken = async (role: Role) => {
  try {
    if (isRefreshing) {
      console.log("Token refresh already in progress");
      return new Promise((resolve) => {
        pendingRequests.push(resolve);
      });
    }

    isRefreshing = true;
    console.log("Started initiating the new access token");

    const response = await axios.post(
      `${envConfig.apiUrl}/api/refreshtoken`,
      { role: role.toLowerCase() },
      { withCredentials: true },
    );

    console.log("Response data:", response.data);

    if (response.data.success) {
      const newAccessToken = response.data.access_token;

      Cookies.set(`${role.toLowerCase()}_access_token`, newAccessToken, {
        path: "/",
      });
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${newAccessToken}`;

      pendingRequests.forEach((resolve) => resolve(newAccessToken));
      pendingRequests = [];

      isRefreshing = false;
      return newAccessToken;
    } else {
      pendingRequests.forEach((resolve) => resolve(null));
      pendingRequests = [];
      isRefreshing = false;
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    pendingRequests.forEach((resolve) => resolve(null));
    pendingRequests = [];
    isRefreshing = false;
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const urlpath = error.config?.url || "";
    const role = getRoleFromUrl(urlpath);

    if (
      error.response?.status === 403 &&
      error.response?.data?.accountBlocked
    ) {
      console.log("Account is blocked, redirecting to login...");

      Cookies.remove(`${role.toLowerCase()}_access_token`);

      delete axiosInstance.defaults.headers.common["Authorization"];

      window.location.href = `/${role.toLowerCase()}/login?blocked=true`;

      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/api/refreshtoken")
    ) {
      try {
        const newAccessToken = await refreshToken(role);
        if (newAccessToken) {
          const newConfig = { ...error.config };
          if (!newConfig.headers) {
            newConfig.headers = {};
          }
          newConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios(newConfig);
        } else {
          throw new Error("Could not get a new token");
        }
      } catch (refreshError) {
        console.error("Could not refresh token, logging out...");
        Cookies.remove(`${role.toLowerCase()}_access_token`);
        window.location.href = `/${role.toLowerCase()}/login`;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/api/refreshtoken")
    ) {
      const urlpath = error.config.url || "";
      let role: Role;

      if (urlpath.includes("/api/technician/")) {
        role = "TECHNICIAN";
      } else if (urlpath.includes("/api/admin/")) {
        role = "ADMIN";
      } else {
        role = "USER";
      }

      try {
        const newAccessToken = await refreshToken(role);
        if (newAccessToken) {
          const newConfig = { ...error.config };
          if (!newConfig.headers) {
            newConfig.headers = {};
          }
          newConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios(newConfig);
        } else {
          throw new Error("Could not get a new token");
        }
      } catch (refreshError) {
        console.error("Could not refresh token, logging out...");
        Cookies.remove(`${role.toLowerCase()}_access_token`);
        window.location.href = `/${role.toLowerCase()}/login`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config) => {
    const urlpath = config.url || "";
    let role = "user";

    if (urlpath.includes("/api/technician/")) {
      role = "technician";
    } else if (urlpath.includes("/api/admin/")) {
      role = "admin";
    } else {
      role = "user";
    }

    const accessToken = Cookies.get(`${role}_access_token`);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const login = async (formData: LoginFormData, role: Role) => {
  const response = await axiosInstance.post<LoginResponse>(
    getAuthUrl(role, "login"),
    formData,
    { withCredentials: true },
  );
  return response.data;
};

const register = async (formData: RegisterFormData, role: UserLikeRoles) => {
  const response = await axiosInstance.post<TempRegisterResponse>(
    getAuthUrl(role, "register"),
    formData,
  );
  return response.data;
};

const verifyOtp = async (
  data: OTPVerification,
  role: UserLikeRoles,
  purpose: "REGISTRATION" | "PASSWORD_RESET" = "REGISTRATION",
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
    { email },
  );
  return response.data;
};

const resetPassword = async (
  email: string,
  password: string,
  role: UserLikeRoles,
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
  refreshToken,
  logOut,
};

export default authService;
