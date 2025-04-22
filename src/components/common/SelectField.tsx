import React from "react";
import { SelectFieldProps } from "../../types/component.types";

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
  touched,
  icon,
  className = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {icon && (
            <div className="flex items-center mb-1">
              {icon}
              {label}
            </div>
          )}
          {!icon && label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur} 
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full px-4 py-3 border ${
          touched && error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touched && error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;