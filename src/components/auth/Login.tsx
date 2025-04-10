import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../../services/auth.services";
import { LoginProps, UserLikeRoles } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ForgotPasswordLink from "../common/ForgotPasswordLink";
import AuthLayout from "../../layouts/AuthLayout";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const Login: React.FC<LoginProps> = ({ role }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData, role);
      console.log("response from the user login component:", response);

      if (response.success) {
        const actualRole = response.role || "USER";
        toast.success("Login successful!");

        Cookies.set(
          `${actualRole.toLowerCase()}_access_token`,
          response.accessToken,
        );
        Cookies.set(
          `${actualRole.toLowerCase()}_refresh_token`,
          response.refreshToken,
        );
        Cookies.set("role", response.role);

        if (actualRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (actualRole === "TECHNICIAN") {
          navigate("/technician/portal");
        } else {
          navigate("/user/home");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role || "USER"}>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
        className="w-full md:w-[28rem] space-y-8"
      >
        <div className="text-center">
          <h4 className="text-3xl font-bold text-black capitalize">
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Login
          </h4>
          <p className="mt-2 text-base text-gray-700">
            Please login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg">
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email..."
            required
          />

          <InputField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password..."
            required
            showToggle
          />

          {role !== "ADMIN" && (
            <ForgotPasswordLink role={role as UserLikeRoles} />
          )}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Processing..." : "Login"}
          </Button>

          {role !== "ADMIN" && (
            <div className="text-center mt-4">
              <p className="text-base text-gray-700">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate(`/${role.toLowerCase()}/register`)}
                  className="font-medium text-black hover:text-gray-700"
                >
                  Sign up to continue.
                </button>
              </p>
            </div>
          )}
        </form>
      </motion.div>
    </AuthLayout>
  );
};
