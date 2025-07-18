import React from "react";
import { Calendar, Star } from "lucide-react";
import { IRating } from "../../models/IRating";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

interface RatingCardProps {
  rating: IRating | null;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  const renderStars = (ratingValue: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= ratingValue
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    }

    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!rating) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Service Rating
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Star className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No rating available</p>
            <p className="text-gray-400 text-sm mt-2">
              This service hasn't been rated yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Service Rating</h2>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {rating.userId.image ? (
                <img
                  src={buildCloudinaryUrl(rating.userId.image)}
                  alt={rating.userId.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-medium text-sm">
                  {rating.userId.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">
                {rating.userId.username}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(rating.rating)}
              </div>
            </div>
          </div>

          {rating.review && rating.review.trim() && (
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {rating.review}
            </p>
          )}

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(rating.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
