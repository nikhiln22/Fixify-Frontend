import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import authService from "../services/auth.services";
import { Role } from "../types/auth.types";
import { showToast } from "../utils/toast";
import { PURGE } from "redux-persist";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const logOut = async () => {
    let currentInterface: Role = "USER";
    if (location.pathname.includes("/admin/")) {
      currentInterface = "ADMIN";
    } else if (location.pathname.includes("/technician/")) {
      currentInterface = "TECHNICIAN";
    } else if (location.pathname.includes("/user/")) {
      currentInterface = "USER";
    }

    try {
      const response = await authService.logOut(currentInterface);

      if (response.success) {
        dispatch({
          type: PURGE,
          key: "root",
          result: () => null,
        });

        showToast({
          type: "success",
          message: response.message || "Logged out successfully",
        });

        Cookies.remove("access_token");

        switch (currentInterface) {
          case "USER":
            navigate("/user/login");
            break;
          case "TECHNICIAN":
            navigate("/technician/login");
            break;
          case "ADMIN":
            navigate("/admin/login");
            break;
          default:
            navigate("/");
        }
      } else {
        showToast({
          type: "error",
          message: response.message || "Logout failed",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      showToast({
        type: "error",
        message: "Failed to logout. Please try again.",
      });
    }
  };

  return logOut;
};

export default useLogout;
