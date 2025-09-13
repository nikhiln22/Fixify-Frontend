import React from "react";
import { CardProps } from "../../types/component.types";
import Button from "./Button";

const Card: React.FC<CardProps> = ({
  image,
  title,
  price,
  type,
  serviceType,
  estimatedTime,
  hourlyRate,
  onClick,
  buttonLabel = "Book Now",
}) => {
  const formatEstimatedTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} mins`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} mins`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto w-full">
      <div className="w-full h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        {title && <h3 className="font-medium text-gray-800 mb-2">{title}</h3>}

        {type === "service" && (
          <div className="mt-2 mb-3">
            <div className="flex items-center gap-2 mb-1">
              {serviceType === "hourly" && hourlyRate ? (
                <>
                  <p className="font-semibold text-gray-900 text-lg">
                    ₹{hourlyRate.toLocaleString()}/hr
                  </p>
                </>
              ) : price !== undefined ? (
                <>
                  <p className="font-semibold text-gray-900 text-lg">
                    ₹{price.toLocaleString()}
                  </p>
                  {serviceType === "fixed" && estimatedTime && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {formatEstimatedTime(estimatedTime)}
                      </span>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}

        <Button
          onClick={onClick}
          variant="primary"
          className="mt-3 w-full py-2 text-sm"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default Card;
