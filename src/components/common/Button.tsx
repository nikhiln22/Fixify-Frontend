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
        return `bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
          disabled || isLoading
            ? "from-gray-400 to-gray-500 cursor-not-allowed transform-none shadow-none"
            : ""
        }`;
      case "outline":
        return `border-2 border-teal-500 bg-white hover:bg-teal-50 text-teal-700 hover:border-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
          disabled || isLoading
            ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed transform-none shadow-none"
            : ""
        }`;
      default:
        return `bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
          disabled || isLoading
            ? "from-gray-400 to-gray-500 cursor-not-allowed transform-none shadow-none"
            : ""
        }`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`py-3 px-6 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all duration-200 ease-in-out ${getVariantClasses()} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
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
