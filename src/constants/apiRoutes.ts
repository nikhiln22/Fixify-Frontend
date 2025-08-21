export const USER_API = "/api/user";
export const ADMIN_API = "/api/admin";
export const TECHNICIAN_API = "/api/technician";

export const getApiRoute = (role: string) => {
  if (role === "user") return USER_API;
  if (role === "technician") return TECHNICIAN_API;
  if (role === "admin") return ADMIN_API;
};
