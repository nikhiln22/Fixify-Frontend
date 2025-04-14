import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { resetPassword } from "../../services/auth.services";
import { ResetPasswordProps } from "../../types/auth.types";

export const ResetPassword: React.FC<ResetPasswordProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  console.log("email in the resetpassword component:", email);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(
        "Missing required information. Please try the password reset process again.",
      );
      navigate(`/${role.toLowerCase()}/forgotpassword`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email, password, role);
      toast.success(response.message || "Password reset successful!");
      navigate(`/${role.toLowerCase()}/login`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout role={role}>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
        className="w-full md:w-[28rem] space-y-8"
      >
        <div className="text-center">
          <h4 className="text-3xl font-bold text-black capitalize">
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Reset Password
          </h4>
          <p className="mt-2 text-base text-gray-700">Set your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showToggle
            required
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showToggle
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-base text-gray-700">
              Back to{" "}
              <button
                type="button"
                onClick={() => navigate(`/${role.toLowerCase()}/login`)}
                className="font-medium text-black hover:text-gray-700"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};
