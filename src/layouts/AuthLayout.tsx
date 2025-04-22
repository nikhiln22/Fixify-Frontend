import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import welcomeAnimation from "../assets/welcome-animation.json";
import { AuthLayoutProps } from "../types/component.types";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const animation = welcomeAnimation;

  const [blurAmount, setBlurAmount] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlurAmount(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-200 overflow-hidden">
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "tween",
            duration: 0.7,
            ease: "easeOut",
          }}
          className="w-[55rem] h-[55rem] relative"
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="relative z-10"
            style={{
              filter: `blur(${blurAmount}px)`,
              transition: "filter 0.8s ease-out",
            }}
          >
            <Lottie
              animationData={animation}
              loop={true}
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
            />
          </div>
        </motion.div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <motion.div
          initial={{ x: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            type: "tween",
            duration: 0.7,
            ease: "easeOut",
            filter: { delay: 0.15, duration: 0.55 },
          }}
          className="w-full md:w-[28rem] space-y-8"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;