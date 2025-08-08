import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "../../../components/auth/Login";
import authService from "../../../services/auth.services";
import { showToast } from "../../../utils/toast";
import Cookies from "js-cookie";
import { setUserData } from "../../../redux/slices/userSlice";
import { Iuser } from "../../../models/user";
import { LoginFormData } from "../../../types/auth.types";

export const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSubmit = async (values: LoginFormData) => {
    try {
      const response = await authService.login(values, "USER");
      console.log("response from the user login page:", response);

      if (response.success) {
        showToast({
          message: "Login successful!",
          type: "success",
        });

        const expiresIn15Minutes = new Date(
          new Date().getTime() + 15 * 60 * 1000
        );

        Cookies.set("access_token", response.data.access_token, {
          expires: expiresIn15Minutes,
        });

        const userData = response.data.user as Iuser;
        console.log("username:", userData.username);
        const userInfo = {
          _id: userData._id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          image: userData.image,
        };
        console.log("before dispatching the user details to the state");
        dispatch(setUserData(userInfo));

        navigate("/user/home");
      } else {
        showToast({
          message: response.message,
          type: "error",
        });
      }
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message || "Login failed.",
        type: "error",
      });
    }
  };

  return <Login role="USER" onsubmit={handleLoginSubmit} />;
};
