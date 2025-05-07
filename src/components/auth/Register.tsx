import React from "react";
import { useNavigate } from "react-router-dom";
import { RegisterProps } from "../../types/auth.types";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useFormik } from "formik";
import { registerValidationSchema } from "../../utils/validations/authvalidationschema";

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

      <form onSubmit={formik.handleSubmit} className="space-y-6 p-8 rounded-lg">
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
          disabled={
            formik.isSubmitting ||
            !Object.values(formik.values).every((value) => value) ||
            Object.keys(formik.errors).length > 0
          }
          isLoading={formik.isSubmitting}
          className="w-full mt-4"
        >
          Sign Up
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
    </AuthLayout>
  );
};
