import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { authService } from "../services/authServices";
import { Role } from "../types/auth.types";
import { showToast } from "../utils/toast";
import { useDispatch } from "react-redux";

import { clearUserData } from "../redux/slices/userSlice";
import { clearTechnicianData } from "../redux/slices/technicianslice";
import { clearCouponData } from "../redux/slices/couponSlice";
import { clearAdminData } from "../redux/slices/adminSlice";
import { clearBookingData } from "../redux/slices/bookingSlice";
import { clearOfferData } from "../redux/slices/offerSlice";

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
        switch (currentInterface) {
          case "USER":
            navigate("/user/login", { replace: true });
            break;
          case "TECHNICIAN":
            navigate("/technician/login", { replace: true });
            break;
          case "ADMIN":
            navigate("/admin/login", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }

        switch (currentInterface) {
          case "USER":
            dispatch(clearUserData());
            dispatch(clearCouponData());
            dispatch(clearBookingData());
            dispatch(clearOfferData());
            break;

          case "TECHNICIAN":
            dispatch(clearTechnicianData());
            break;

          case "ADMIN":
            dispatch(clearAdminData());
            break;
        }

        // 3️⃣ Remove authentication cookie
        Cookies.remove("access_token");

        // 4️⃣ Show toast message
        showToast({
          type: "success",
          message: response.message || "Logged out successfully",
        });
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
