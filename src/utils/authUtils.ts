import cookie from "js-cookie";
import { Role } from "../types/auth.types";

export const getAccessToken = (role: Role) => {
  switch (role) {
    case "USER":
      return cookie.get("user_access_token");
    case "ADMIN":
      return cookie.get("admin_access_token");
    case "TECHNICIAN":
      return cookie.get("technician_access_token");
    default:
      return null;
  }
};

export const getTokenRole = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    console.log("error decoding the token:", error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};
