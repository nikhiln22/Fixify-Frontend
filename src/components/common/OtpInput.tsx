import React, { useRef } from "react";
import { OTPInputProps } from "../../types/component.types";

const OTPInput: React.FC<OTPInputProps> = ({ length, value, onchange }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value.replace(/\D/, "");
    const otpArray = value.split("");

    if (val) {
      otpArray[index] = val;
      onchange(otpArray.join(""));
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus(); // Move to next input
      }
    } else {
      otpArray[index] = "";
      onchange(otpArray.join("")); // Remove the value in Formik state
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move focus to previous input
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""} // Controlled value from Formik
          onChange={(e) => handleChange(e, index)} // Update Formik value
          onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace to focus previous input
          className="w-12 h-12 text-center text-xl border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      ))}
    </div>
  );
};

export default OTPInput;
