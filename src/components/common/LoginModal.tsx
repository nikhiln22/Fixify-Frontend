import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const cardVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative flex flex-col md:flex-row gap-8 px-4">
              <button
                onClick={onClose}
                className="absolute -top-8 -right-8 p-2 z-10 transition-transform hover:scale-110"
                aria-label="Close modal"
              >
                <X size={32} className="text-black" strokeWidth={2.5} />
              </button>

              <motion.div
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
                className="relative overflow-hidden"
                style={{
                  width: "440px",
                  borderRadius: "16px",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2)",
                  background: "linear-gradient(to top, #9ca3af, #e5e7eb)",
                }}
              >
                <div className="p-14 text-center">
                  <div
                    className="flex justify-center items-center w-40 h-40 bg-gray-200 rounded-full mx-auto mb-10"
                    style={{
                      boxShadow:
                        "0 15px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span className="text-gray-900 text-6xl">&#x1F464;</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Login as User
                  </h3>
                  <p className="text-xl text-gray-600 mb-10">
                    Find and book services for your home
                  </p>

                  <Button
                    onClick={() => (window.location.href = "/user/login")}
                    className="w-full py-6 bg-black hover:bg-gray-800 text-xl font-semibold rounded-xl text-white"
                    style={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Login as User
                  </Button>

                  <p className="mt-8 text-gray-600">
                    Not registered?{" "}
                    <a
                      href="/user/register"
                      className="text-gray-800 hover:underline font-medium"
                    >
                      Create an account
                    </a>
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
                className="relative overflow-hidden"
                style={{
                  width: "440px",
                  borderRadius: "16px",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2)",
                  background: "linear-gradient(to top, #9ca3af, #e5e7eb)",
                }}
              >
                <div className="p-14 text-center">
                  <div
                    className="flex justify-center items-center w-40 h-40 bg-gray-200 rounded-full mx-auto mb-10"
                    style={{
                      boxShadow:
                        "0 15px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span className="text-gray-900 text-6xl">&#x1F6E0;</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    Login as Technician
                  </h3>
                  <p className="text-xl text-gray-600 mb-10">
                    Offer your services and grow your business
                  </p>

                  <Button
                    onClick={() => (window.location.href = "/technician/login")}
                    className="w-full py-6 bg-black hover:bg-gray-800 text-xl font-semibold rounded-xl text-white"
                    style={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Login as Technician
                  </Button>

                  <p className="mt-8 text-gray-600">
                    Not registered?{" "}
                    <a
                      href="/technician/register"
                      className="text-gray-800 hover:underline font-medium"
                    >
                      Join as a technician
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
