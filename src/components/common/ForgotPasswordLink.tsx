import { useNavigate } from "react-router-dom";
import React from "react";
import { ForgotPasswordLinkProps } from "../../types/auth.types";

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ role }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/${role.toLowerCase()}/forgotpassword`)}
      className="text-sm text-gray-700 hover:underline mt-2"
    >
      Forgot Password?
    </button>
  );
};

export default ForgotPasswordLink;
