import React from "react";
import { ButtonProps } from "../../types/component.types";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  children,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-3 px-4 rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
        disabled
          ? "bg-gray-500 text-white cursor-not-allowed"
          : "bg-black text-white hover:bg-gray-800"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
