import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  role: "user" | "admin" | "technician";
  className?: string;
  size?: "small" | "medium" | "large";
}

export const Logo: React.FC<LogoProps> = ({ 
  role, 
  className = "", 
  size = "medium" 
}) => {
  const getNavigationLink = () => {
    switch (role) {
      case "user":
        return "/user/home";
      case "technician":
        return "/technician/portal";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-lg";
      case "large":
        return "text-3xl";
      default:
        return "text-2xl";
    }
  };

  const getDotSize = () => {
    switch (size) {
      case "small":
        return "w-1.5 h-1.5";
      case "large":
        return "w-3 h-3";
      default:
        return "w-2 h-2";
    }
  };

  return (
    <Link to={getNavigationLink()} className={`flex items-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-1">
          <span className={`${getSizeClasses()} font-bold text-cyan-500`}>F</span>
          <span className={`${getSizeClasses()} font-bold text-slate-800 relative`}>
            I
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${getDotSize()} bg-orange-400 rounded-sm`}></div>
          </span>
          <span className={`${getSizeClasses()} font-bold text-slate-800`}>X</span>
          <span className={`${getSizeClasses()} font-bold text-slate-800`}>I</span>
          <span className={`${getSizeClasses()} font-bold text-cyan-500`}>F</span>
          <span className={`${getSizeClasses()} font-bold text-slate-800`}>Y</span>
        </div>
      </div>
    </Link>
  );
};