import React from "react";
import { useFormik } from "formik";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { ResetPasswordProps } from "../../types/auth.types";
import { resetPasswordValidationSchema } from "../../utils/validations/authvalidationschema";

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  role,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await onSubmit(values.password);
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
            {role[0].toUpperCase() + role.slice(1).toLowerCase()} Reset Password
          </h4>
          <p className="mt-2 text-base text-gray-700">Set your new password</p>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 p-8 rounded-lg"
        >
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password..."
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            showToggle
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password..."
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
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
            Reset Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
