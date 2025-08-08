import React from "react";
import { CardProps } from "../../types/component.types";
import Button from "./Button";

const Card: React.FC<CardProps> = ({
  image,
  title,
  price,
  type,
  onClick,
  buttonLabel = "Book Now",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto w-full">
      <div className="w-full h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        {title && <h3 className="font-medium text-gray-800 mb-2">{title}</h3>}

        {type === "service" && price !== undefined && (
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-gray-900">
              ₹{price.toLocaleString()}
            </p>
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
