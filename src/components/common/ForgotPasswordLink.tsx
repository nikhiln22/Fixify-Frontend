import { useNavigate } from "react-router-dom";
import React from "react";

const ForgotPasswordLink: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/forgot-password")}
      className="text-sm text-gray-700 hover:underline mt-2"
    >
      Forgot Password?
    </button>
  );
};

export default ForgotPasswordLink;
