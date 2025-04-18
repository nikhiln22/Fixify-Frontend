import React from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.services";
import { LoginProps, UserLikeRoles } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ForgotPasswordLink from "../common/ForgotPasswordLink";
import AuthLayout from "../../layouts/AuthLayout";
import Cookies from "js-cookie";
import { showToast } from "../../utils/toast";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../utils/validations/authvalidationschema";

export const Login: React.FC<LoginProps> = ({ role }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await login(values, role);
        console.log("response from the user login component:", response.data);
        if (response.success) {
          const serverRole = response.data.role || "USER";
          console.log("serverRole in login component:", serverRole);
          
          showToast({
            message: "Login successful!",
            type: "success",
          });
          
          Cookies.set(
            `${serverRole.toLowerCase()}_access_token`,
            response.access_Token
          );
          Cookies.set(
            `${serverRole.toLowerCase()}_refresh_token`,
            response.refresh_Token
          );
          Cookies.set("role", serverRole);
          
          switch (serverRole.toUpperCase()) {
            case "ADMIN":
              navigate("/admin/dashboard");
              break;
            case "TECHNICIAN":
              navigate("/technician/portal");
              break;
            case "USER":
              navigate("/user/home");
              break;
            default:
              navigate("/user/home");
              break;
          }
        } else {
          showToast({
            message: response.message || "Login failed",
            type: "error",
          });
        }
      } catch (err: any) {
        showToast({
          message: err?.response?.data?.message || "Login failed.",
          type: "error",
        });
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
        <p className="mt-2 text-base text-gray-700">
          Please login to continue
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
        <InputField
          label="Password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          type="password"
          placeholder="Enter your password..."
          required
          error={formik.errors.password}
          touched={formik.touched.password}
          showToggle
        />
        {role !== "ADMIN" && (
          <ForgotPasswordLink role={role as UserLikeRoles} />
        )}
        <Button type="submit" disabled={formik.isSubmitting} className="w-full mt-4">
          {formik.isSubmitting ? "Processing..." : "Login"}
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