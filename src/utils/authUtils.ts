import cookie from "js-cookie";

export const getAccessToken = (role: "user" | "admin" | "technician") => {
  switch (role) {
    case "user":
      return cookie.get("user_access_token");
    case "admin":
      return cookie.get("admin_access_token");
    case "technician":
      return cookie.get("technician_access_token");
    default:
      return null;
  }
};
