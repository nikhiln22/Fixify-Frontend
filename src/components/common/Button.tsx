import React from "react";
import { ButtonProps } from "../../types/component.types";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  children,
  className,
  variant = "primary",
  isLoading = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `bg-black text-white hover:bg-gray-800 ${disabled || isLoading ? "bg-gray-500 cursor-not-allowed" : ""}`;
      case "outline":
        return `border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 ${disabled || isLoading ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`;
      default:
        return `bg-black text-white hover:bg-gray-800 ${disabled || isLoading ? "bg-gray-500 cursor-not-allowed" : ""}`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`py-3 px-4 rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${getVariantClasses()} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
