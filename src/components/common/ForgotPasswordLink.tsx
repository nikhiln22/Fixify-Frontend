import { useNavigate } from "react-router-dom";
import React from "react";
import { ForgotPasswordLinkProps } from "../../types/auth.types";

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ role }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => navigate(`/${role.toLowerCase()}/forgotpassword`)}
        className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200 relative group"
      >
        Forgot Password?
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
      </button>
    </div>
  );
};

export default ForgotPasswordLink;