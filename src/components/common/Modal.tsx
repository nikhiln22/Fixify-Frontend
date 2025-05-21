import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalProps } from "../../types/component.types";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  confirmButtonColor = "blue",
  className,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  };

  const getButtonColorClass = () => {
    switch (confirmButtonColor) {
      case "red":
        return "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500";
      case "green":
        return "bg-green-500 hover:bg-green-600 focus-visible:ring-green-500";
      default:
        return "bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-500";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                className={`w-full transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white px-8 py-6 text-center align-middle shadow-xl border border-gray-100 ${className || "max-w-2xl"}`}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {title && (
                  <h3 className="text-2xl font-medium leading-tight text-gray-800 mb-3">
                    {title}
                  </h3>
                )}

                <div className="mt-3">
                  <div className="text-lg text-gray-700">{children}</div>
                </div>

                {(cancelText || confirmText) && (
                  <div className="mt-8 flex justify-center space-x-6">
                    {cancelText && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-200 bg-white px-6 py-3 text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
                        onClick={onClose}
                      >
                        {cancelText}
                      </button>
                    )}

                    {confirmText && onConfirm && (
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent px-6 py-3 text-lg font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200 ${getButtonColorClass()}`}
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                      >
                        {confirmText}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
