import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthLayoutProps } from "../types/component.types";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [blurAmount, setBlurAmount] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlurAmount(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100"></div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "tween",
            duration: 0.7,
            ease: "easeOut",
          }}
          className="flex flex-col items-center justify-center space-y-8"
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 shadow-2xl"
            style={{
              filter: `blur(${blurAmount}px)`,
              transition: "filter 0.8s ease-out",
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-7xl font-bold text-cyan-500">F</span>
                <span className="text-7xl font-bold text-slate-800 relative">
                  I
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-sm"></div>
                </span>
                <span className="text-7xl font-bold text-slate-800">X</span>
                <span className="text-7xl font-bold text-slate-800">I</span>
                <span className="text-7xl font-bold text-cyan-500">F</span>
                <span className="text-7xl font-bold text-slate-800">Y</span>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-0.5 w-80 bg-cyan-500"></div>
                <div className="flex items-center space-x-1 ml-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 mt-4 tracking-widest font-medium">
                PREMIUM HOME REPAIR SERVICES
              </p>
            </div>
          </div>

        </motion.div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 p-8">
        <motion.div
          initial={{ x: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            type: "tween",
            duration: 0.7,
            ease: "easeOut",
            filter: { delay: 0.15, duration: 0.55 },
          }}
          className="w-full max-w-xl"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20 hover:shadow-3xl transition-all duration-300">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;