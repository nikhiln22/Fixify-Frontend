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
}) => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="flex flex-col items-start w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-12 ${className}`}
        />

        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
