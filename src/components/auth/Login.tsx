import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginProps, UserLikeRoles } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ForgotPasswordLink from "../common/ForgotPasswordLink";
import AuthLayout from "../../layouts/AuthLayout";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../utils/validations/authvalidationschema";
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
      <div className="text-center">
        <h4 className="text-3xl font-bold text-black capitalize">
          {role[0].toUpperCase() + role.slice(1).toLowerCase()} Login
        </h4>
        <p className="mt-2 text-base text-gray-700">Please login to continue</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6 p-8 rounded-lg">
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
        {role !== "ADMIN" && (
          <ForgotPasswordLink role={role as UserLikeRoles} />
        )}
        <Button
          type="submit"
          disabled={
            formik.isSubmitting ||
            !Object.values(formik.values).every((value) => value) ||
            Object.keys(formik.errors).length > 0
          }
          isLoading={formik.isSubmitting}
          className="w-full mt-4"
        >
          Login
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
    </AuthLayout>
  );
};
