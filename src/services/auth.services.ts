import axios from "axios";
import {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  Role,
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

export const register = async (formData: RegisterFormData, role: Role) => {
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/${role.toLowerCase()}/register`,
    {
      ...formData,
    }
  );
  return response.data;
};
