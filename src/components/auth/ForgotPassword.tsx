import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { ForgotPasswordProps } from "../../types/auth.types";
import { useFormik } from "formik";
import { forgotPasswordValidationSchema } from "../../utils/validations/authvalidationschema";
import { motion } from "framer-motion";

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  role,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSubmit(values.email);
      } catch (err) {
        console.log("error occured:", err);
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
            Reset Password
          </h4>
          <p className="text-lg text-gray-600 font-medium">Enter your email</p>
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
              label="Email Address"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              placeholder="Enter your email address..."
              error={formik.errors.email}
              touched={formik.touched.email}
              onBlur={formik.handleBlur}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
              {formik.isSubmitting ? "Sending OTP..." : "Send Reset Code"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center pt-4"
          >
            <p className="text-base text-gray-600">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate(`/${role.toLowerCase()}/login`)}
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 relative group"
              >
                Back to Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </AuthLayout>
  );
};
