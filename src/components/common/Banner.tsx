import React from "react";
import { BannerProps } from "../../types/component.types";

const Banner: React.FC<BannerProps> = ({
  className = "",
  backgroundImage,
  backgroundColor = "#f4f4f4",
  height = "300px",
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
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        height,
      }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}
    </div>
  );
};

export default Banner;
