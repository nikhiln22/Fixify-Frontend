import axios from "axios";
import { envConfig } from "./env.config";

const axiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
