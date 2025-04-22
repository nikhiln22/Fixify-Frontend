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
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      otpArray[index] = "";
      onchange(otpArray.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)} 
          onKeyDown={(e) => handleKeyDown(e, index)} 
          className="w-12 h-12 text-center text-xl border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      ))}
    </div>
  );
};

export default OTPInput;
