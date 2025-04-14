import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/auth.services";
import { ForgotPasswordProps } from "../../types/auth.types";

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ role }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email, role);
      toast.success(response.message || `OTP sent to ${email}.`);
      navigate(`/${role.toLowerCase()}/otp`, {
        state: { email, action: "forgot" },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
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
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Forgot
            Password
          </h4>
          <p className="mt-2 text-base text-gray-700">
            Enter your email to receive an OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg">
          <InputField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email..."
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Sending OTP..." : "Submit"}
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
