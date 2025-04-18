import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  RegisterProps, 
  isUserTempRegisterResponse,
  isTechnicianTempRegisterResponse
} from "../../types/auth.types";
import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { register } from "../../services/auth.services";
import { useFormik } from "formik";
import { showToast } from "../../utils/toast";
import { registerValidationSchema } from "../../utils/validations/authvalidationschema";


export const Register: React.FC<RegisterProps> = ({ role }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema:registerValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSend = {
        ...values,
      };

      try {
        const response = await register(dataToSend, role);
        if (response.success) {
          showToast({
            message: `OTP has been sent to ${values.email}`,
            type: "success",
          });
          
          let stateData;
          
          if (isTechnicianTempRegisterResponse(response)) {
            stateData = {
              email: response.email,
              action: "register",
              role: role,
              tempTechnicianId: response.tempTechnicianId
            };
          } else if (isUserTempRegisterResponse(response)) {
            stateData = {
              email: response.email,
              action: "register",
              role: role,
              tempUserId: response.tempUserId
            };
          } else {
            console.error("Unexpected response format:", response);
            showToast({
              message: "Unexpected response from server",
              type: "error",
            });
            return;
          }
          
          navigate(`/${role.toLowerCase()}/otp`, { state: stateData });
        }
      } catch (error: any) {

        showToast({
          message: error?.response?.data?.message || "Registration failed",
          type: "error",
        });
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

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 p-8 rounded-lg"
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
          required
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
          className="w-full mt-4"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Processing..." : "Sign Up"}
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