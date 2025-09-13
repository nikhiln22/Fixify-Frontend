import React, { useState } from "react";
import {
  Star,
  MessageCircle,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IRating } from "../../models/IRating";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

interface ReviewSectionProps {
  reviews: IRating[];
  loading?: boolean;
  error?: string | null;
  averageRating?: number;
  totalReviews?: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  loading,
  error,
  averageRating,
  totalReviews,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reviewsPerSlide = 3;
  const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-md p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-md p-8">
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Reviews & Ratings
        </h2>
        {averageRating && totalReviews && (
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating), "sm")}
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Reviews will appear here once customers rate your services
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {reviews
                        .slice(
                          slideIndex * reviewsPerSlide,
                          (slideIndex + 1) * reviewsPerSlide
                        )
                        .map((review) => (
                          <div
                            key={review._id}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-shrink-0">
                                {review.userId.image ? (
                                  <img
                                    src={buildCloudinaryUrl(
                                      review.userId.image
                                    )}
                                    alt={review.userId.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {review.userId.username}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {renderStars(review.rating, "sm")}
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
                              {review.review}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={prevSlide}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
