import React from "react";
import { useNavigate } from "react-router-dom";
import { RegisterProps } from "../../types/auth.types";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { register } from "../../services/auth.services";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

export const Register: React.FC<RegisterProps> = ({ role }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email (e.g., user@example.com)"
      )
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Password must contain at least one uppercase, one lowercase, one number and one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    experience:
      role === "TECHNICIAN"
        ? Yup.string().required("Experience is required")
        : Yup.string(),
    technicianRole:
      role === "TECHNICIAN"
        ? Yup.string().required("Please select a technician role")
        : Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      experience: "",
      technicianRole: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSend = {
        ...values,
        role,
      };

      try {
        const response = await register(dataToSend, role);
        if (response.success) {
          toast.success(`OTP has been sent to ${values.email}`);
          navigate(`/${role.toLowerCase()}/otp`, {
            state: {
              tempUserId: response.tempUserId,
              email: response.email,
              role,
              action: "register",
            },
          });
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

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

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 p-8 rounded-lg"
        >
          <InputField
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.errors.username}
            touched={formik.touched.username}
            onBlur={formik.handleBlur}
          />

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.errors.email}
            touched={formik.touched.email}
            onBlur={formik.handleBlur}
          />

          <InputField
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.errors.phone}
            touched={formik.touched.phone}
            onBlur={formik.handleBlur}
          />

          {role === "TECHNICIAN" && (
            <>
              <InputField
                name="experience"
                label="Years of Experience"
                placeholder="Enter your experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                error={formik.errors.experience}
                touched={formik.touched.experience}
                onBlur={formik.handleBlur}
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
                  value={formik.values.technicianRole}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="Plumbing">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpentry">Carpenter</option>
                  <option value="Beautician">Beautician</option>
                </select>
                {formik.touched.technicianRole &&
                  formik.errors.technicianRole && (
                    <span className="text-red-500 text-sm mt-1">
                      {formik.errors.technicianRole}
                    </span>
                  )}
              </div>
            </>
          )}

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.errors.password}
            touched={formik.touched.password}
            onBlur={formik.handleBlur}
            required
            showToggle
          />

          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            onBlur={formik.handleBlur}
            required
            showToggle
          />

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Processing..." : "Sign Up"}
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
