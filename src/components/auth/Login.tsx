import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginProps, UserLikeRoles } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ForgotPasswordLink from "../common/ForgotPasswordLink";
import AuthLayout from "../../layouts/AuthLayout";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../utils/validations/authvalidationschema";
import { motion } from "framer-motion";

export const Login: React.FC<LoginProps> = ({ role, onsubmit }) => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onsubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout role={role || "USER"}>
      <div className="space-y-8">
        {/* Header with animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent capitalize">
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Login
          </h4>
          <p className="text-lg text-gray-600 font-medium">
            Please login to continue
          </p>
        </motion.div>

        {/* Form with improved styling */}
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
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              placeholder="Enter your email..."
              error={formik.errors.email}
              touched={formik.touched.email}
              onBlur={formik.handleBlur}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <InputField
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Enter your password..."
              error={formik.errors.password}
              touched={formik.touched.password}
              showToggle
            />
          </motion.div>

          {role !== "ADMIN" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ForgotPasswordLink role={role as UserLikeRoles} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
              {formik.isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </motion.div>

          {role !== "ADMIN" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center pt-4"
            >
              <p className="text-base text-gray-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate(`/${role.toLowerCase()}/register`)}
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 relative group"
                >
                  Sign up to continue.
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </p>
            </motion.div>
          )}
        </motion.form>
      </div>
    </AuthLayout>
  );
};
