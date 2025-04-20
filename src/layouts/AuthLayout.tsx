import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import userAnimation from "../assets/welcome-animation.json";
// import technicianAnimation from "../assets/employee-animation.json";
// import workerAnimation from "../assets/worker-animation.json";
import { AuthLayoutProps } from "../types/component.types";

const animationMap: Partial<Record<AuthLayoutProps["role"], unknown>> = {
  USER: userAnimation,
  // TECHNICIAN: technicianAnimation,
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ role, children }) => {
  const animation = animationMap[role];
  
  return (
    <div className="min-h-screen flex bg-gray-200 overflow-hidden">
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
          className="w-[55rem] h-[55rem]"
        >
          <Lottie animationData={animation} loop={true} />
        </motion.div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "tween", duration: 1.5, ease: "easeOut" }}
          className="w-full md:w-[28rem] space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;