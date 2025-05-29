import React from "react";
import { CardProps } from "../../types/component.types";
import { Star } from "lucide-react";

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
  const getDummyRating = () => {
    const ratings = [4.5, 4.2, 4.8, 4.1, 4.6, 4.3, 4.7, 4.0, 4.4, 4.9];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(
          <Star
            key={i}
            className="text-yellow-500 w-4 h-4"
            fill="currentColor"
          />,
        );
      } else if (i - 0.5 <= ratingValue) {
        stars.push(
          <Star
            key={i}
            className="text-yellow-500 w-4 h-4"
            fill="transparent"
          />,
        );
      } else {
        stars.push(
          <Star key={i} className="text-gray-300 w-4 h-4" fill="transparent" />,
        );
      }
    }

    return stars;
  };

  const displayRating = type === "service" ? rating || getDummyRating() : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto w-full">
      <div className="w-full h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        {title && <h3 className="font-medium text-gray-800 mb-2">{title}</h3>}

        {type === "service" && displayRating && (
          <div className="flex items-center mt-2">
            <div className="flex items-center gap-1">
              {renderStars(displayRating)}
              <span className="text-sm text-gray-600 ml-1">
                ({displayRating.toFixed(1)})
              </span>
            </div>
            {reviews && (
              <span className="text-sm text-gray-500 ml-2">
                {/* ({reviews > 1000 ? `${Math.floor(reviews/1000)}K` : reviews}) */}
              </span>
            )}
          </div>
        )}

        {/* Price for services */}
        {type === "service" && price !== undefined && (
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium text-gray-900">
              ₹{price.toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={onClick}
          className="mt-3 w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default Card;
