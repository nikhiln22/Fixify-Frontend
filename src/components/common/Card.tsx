import React from "react";
import { CardProps } from "../../types/component.types";
import { Star } from 'lucide-react';

const Card: React.FC<CardProps> = ({
  image,
  title,
  price,
  rating,
  reviews,
  type,
  onClick,
  buttonLabel = "Book Now",
}) => {
     return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
    >
      <img src={image} alt={title} className="w-full h-40 object-cover" />

      <div className="p-4 space-y-2">
        {title && (
          <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        )}

        {type === 'service' && rating && (
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{rating.toFixed(2)}</span>
            {reviews && <span className="text-gray-500 ml-1">({reviews})</span>}
          </div>
        )}

        {type === 'service' && price !== undefined && (
          <p className="text-lg font-medium text-gray-800">₹{price.toLocaleString()}</p>
        )}

        <button
          onClick={onClick}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md text-sm font-semibold"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default Card;
