import React from "react";
import { useNavigate } from "react-router-dom";
import { RegisterProps } from "../../types/auth.types";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useFormik } from "formik";
import { registerValidationSchema } from "../../utils/validations/authvalidationschema";
import { motion } from "framer-motion";

export const Register: React.FC<RegisterProps> = ({ role, onSubmit }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout role={role}>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent capitalize">
            {role === "TECHNICIAN" ? "Technician Sign Up" : "User Sign Up"}
          </h4>
          <p className="text-lg text-gray-600 font-medium">
            {role === "TECHNICIAN"
              ? "Join our skilled professional network"
              : "Sign up and start exploring Fixify"}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
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
              showToggle
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !Object.values(formik.values).every((value) => value) ||
                Object.keys(formik.errors).length > 0
              }
              isLoading={formik.isSubmitting}
              className="w-full py-4 text-base font-semibold"
            >
              {formik.isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center pt-4"
          >
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(`/${role.toLowerCase()}/login`)}
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 relative group"
              >
                Log in here.
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </AuthLayout>
  );
};
