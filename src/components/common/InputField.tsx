import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputFieldProps } from "../../types/component.types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  showToggle,
  className,
  error,
  touched,
  onBlur,
  disabled,
  min,
  max,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="flex flex-col items-start w-full space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-700 transition-colors duration-200"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative w-full group">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl shadow-sm
            placeholder-gray-400 bg-white/50 backdrop-blur-sm
            focus:outline-none transition-all duration-200 ease-in-out
            ${
              touched && error
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : isFocused
                  ? "border-teal-500 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  : "border-gray-300 hover:border-gray-400"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${showToggle ? "pr-12" : ""}
            ${className}
          `}
        />

        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-teal-600 transition-colors duration-200 p-1 rounded-lg hover:bg-teal-50"
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {isFocused && !error && (
          <div className="absolute inset-0 rounded-xl border-2 border-teal-500 pointer-events-none animate-pulse"></div>
        )}
      </div>

      {touched && error && (
        <div className="flex items-center space-x-1 text-red-500 text-sm animate-fadeIn">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;
