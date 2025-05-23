import React from "react";
import { BannerProps } from "../../types/component.types";

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  className = "",
  children,
  backgroundImage,
  backgroundColor = "#f4f4f4",
  height = "300px",
}) => {
  return (
    <div
      className={`w-full flex items-center justify-center text-center px-4 ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundColor: backgroundImage ? undefined : backgroundColor,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height,
      }}
    >
      <div className="bg-black bg-opacity-50 p-6 rounded-lg text-white max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-md md:text-lg mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default Banner;
