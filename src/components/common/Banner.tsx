import React from "react";
import { BannerProps } from "../../types/component.types";

const Banner: React.FC<BannerProps> = ({
  className = "",
  backgroundImage,
  backgroundColor = "#f4f4f4",
  height = "300px",
  children,
  overlay = false,
  overlayColor = "rgba(0, 0, 0, 0.3)",
}) => {
  return (
    <div
      className={`w-full relative ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundColor: backgroundImage ? undefined : backgroundColor,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height,
      }}
    >
      {overlay && backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
          }}
        />
      )}

      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center text-white">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Banner;
