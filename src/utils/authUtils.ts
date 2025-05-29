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
