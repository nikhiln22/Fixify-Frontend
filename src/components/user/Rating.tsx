import React from "react";

interface RatingComponentProps {
  rating: number;
  setRating: (rating: number) => void;
  review: string;
  setReview: (review: string) => void;
}

export const Rating: React.FC<RatingComponentProps> = ({
  rating,
  setRating,
  review,
  setReview,
}) => {
  return (
    <div className="text-left">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex space-x-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-1">
          {rating > 0 ? `${rating}/5` : "Please select a rating"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Review
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={500}
        />
      </div>
    </div>
  );
};
