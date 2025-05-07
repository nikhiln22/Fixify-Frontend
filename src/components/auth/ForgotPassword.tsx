import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { ForgotPasswordProps } from "../../types/auth.types";
import { useFormik } from "formik";
import { forgotPasswordValidationSchema } from "../../utils/validations/authvalidationschema";

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  role,
  onSubmit,
}) => {
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
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 p-8 rounded-lg"
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
            submit
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
