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
      className={`w-full ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundColor: backgroundImage ? undefined : backgroundColor,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height,
      }}
    />
  );
};

export default Banner;
