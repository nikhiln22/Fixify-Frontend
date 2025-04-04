import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterProps } from "../../types/auth.types";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { register } from "../../services/auth.services";
import { motion } from "framer-motion";

export const Register: React.FC<RegisterProps> = ({ role }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    experience: "",
    technicianRole: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      role,
    };

    try {
      await register(dataToSend, role);
      navigate("/otp");
    } catch (error) {
      alert("Registration failed");
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
            {role === "TECHNICIAN" ? "Technician Sign Up" : "User Sign Up"}
          </h4>
          <p className="mt-2 text-base text-gray-700">
            {role === "TECHNICIAN"
              ? "Join our skilled professional network"
              : "Sign up and start exploring Fixify"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg">
          <InputField
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          {role === "TECHNICIAN" && (
            <>
              <InputField
                name="experience"
                label="Years of Experience"
                placeholder="Enter your experience"
                value={formData.experience}
                onChange={handleChange}
              />

              <div className="flex flex-col items-start">
                <label
                  htmlFor="technicianRole"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role Applying For
                </label>
                <select
                  id="technicianRole"
                  name="technicianRole"
                  value={formData.technicianRole}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="Plumbing">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpentry">Carpenter</option>
                  <option value="Beautician">Beautician</option>
                </select>
              </div>
            </>
          )}

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            showToggle
          />

          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            showToggle
          />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Processing..." : "Sign Up"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-base text-gray-700">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(`/${role.toLowerCase()}/login`)}
                className="font-medium text-black hover:text-gray-700"
              >
                Log in here.
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};