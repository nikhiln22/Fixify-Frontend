import React from "react";

interface TechnicianCardProps {
  technician: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    experience: string;
    profileImage: string;
    verified: boolean;
  };
  onSelect?: () => void; 
  showBookButton?: boolean; 
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({ 
  technician, 
  onSelect, 
  showBookButton = true  
}) => {
  const { id, name, rating, reviewCount, experience, profileImage, verified } =
    technician;

  const renderStars = (rating: any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-fill)"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={profileImage}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {name}
              </h3>
              {verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">{renderStars(rating)}</div>
              <span className="text-sm font-medium text-gray-900">
                {rating}
              </span>
              <span className="text-sm text-gray-500">
                ({reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                  />
                </svg>
                {experience}
              </span>
            </div>
          </div>
        </div>

        {/* Conditionally render Book Now button */}
        {showBookButton && onSelect && (
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={onSelect}
              className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianCard;