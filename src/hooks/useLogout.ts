import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const logOut = () => {
    let currentInterface = "default";
    if (location.pathname.includes("/admin/")) {
      currentInterface = "admin";
    } else if (location.pathname.includes("/technician/")) {
      currentInterface = "technician";
    } else if (location.pathname.includes("/user/")) {
      currentInterface = "user";
    }
    
    Cookies.remove(`${currentInterface}_access_token`);
    Cookies.remove(`${currentInterface}_refresh_token`);
    
    switch (currentInterface) {
      case "user":
        navigate("/user/login");
        break;
      case "technician":
        navigate("/technician/login");
        break;
      case "admin":
        navigate("/admin/login");
        break;
      default:
        navigate("/");
    }
  };
  
  return logOut;
};

export default useLogout;