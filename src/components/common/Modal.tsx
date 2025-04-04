import React from "react";
import { ModalProps } from "../../types/component.types";

const Modal: React.FC<ModalProps> = ({ isopen, onclose, children }) => {
  if (!isopen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-40">
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onclose}
          className="absolute -top-6 -right-6 text-white text-4xl font-bold"
        >
          &times;
        </button>
        {/* Children (actual modal cards) */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
