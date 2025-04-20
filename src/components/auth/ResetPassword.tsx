import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { resetPassword } from "../../services/auth.services";
import { ResetPasswordProps } from "../../types/auth.types";
import { showToast } from "../../utils/toast";
import { resetPasswordValidationSchema } from "../../utils/validations/authvalidationschema"; 

export const ResetPassword: React.FC<ResetPasswordProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  console.log("email in the resetpassword component:", email);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!email) {
        showToast({
          message: "Missing required information. Please try the password reset process again.",
          type: "error",
        });
        navigate(`/${role.toLowerCase()}/forgotpassword`);
        return;
      }

      setLoading(true);
      try {
        const response = await resetPassword(email, values.password, role);
        showToast({
          message: response.message || "Password reset successful!",
          type: "success",
        });
        navigate(`/${role.toLowerCase()}/login`);
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.message || "Failed to reset password.",
          type: "error",
        });
      } finally {
        setLoading(false);
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
        
        <form onSubmit={formik.handleSubmit} className="space-y-6 p-8 rounded-lg">
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
            required
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
            required
          />

          <Button 
            type="submit" 
            disabled={loading || formik.isSubmitting} 
            className="w-full mt-4"
          >
            {loading ? "Resetting..." : "Reset Password"}
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