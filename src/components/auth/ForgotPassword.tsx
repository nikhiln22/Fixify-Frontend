import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/auth.services";
import { ForgotPasswordProps } from "../../types/auth.types";
import { showToast } from "../../utils/toast";
import { useFormik } from "formik";
import { forgotPasswordValidationSchema } from "../../utils/validations/authvalidationschema"; 

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ role }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await forgotPassword(values.email, role);
        showToast({
          message: response.message || `OTP sent to ${values.email}.`,
          type: "success",
        });
        navigate(`/${role.toLowerCase()}/otp`, {
          state: { email: values.email, action: "forgot" },
        });
      } catch (err: any) {
        showToast({
          message: err?.response?.data?.message || "Failed to send OTP.",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout role={role}>
      <div className="w-full md:w-[28rem] space-y-8">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-black capitalize">
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Forgot
            Password
          </h4>
          <p className="mt-2 text-base text-gray-700">
            Enter your email to receive an OTP
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-8 rounded-lg">
          <InputField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            type="email"
            placeholder="Enter your email..."
            required
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <Button type="submit" disabled={formik.isSubmitting} className="w-full mt-4">
            {formik.isSubmitting ? "Sending OTP..." : "Submit"}
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
      </div>
    </AuthLayout>
  );
};