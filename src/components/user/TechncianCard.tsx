import React from "react";
import { Star, Briefcase, CheckCircle } from "lucide-react";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

interface TechnicianCardProps {
  technician: {
    id?: string;
    name: string;
    rating?: number;
    reviewCount?: number;
    experience?: string | number;
    designation?: string;
    profileImage: string;
    verified: boolean;
  };
  onSelect?: () => void;
  showBookButton?: boolean;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onSelect,
  showBookButton = true,
}) => {
  const {
    id,
    name,
    rating,
    reviewCount,
    experience,
    designation,
    profileImage,
    verified,
  } = technician;

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const formatExperience = (exp?: string | number) => {
    if (!exp) return "Not specified";
    if (typeof exp === "number") return `${exp}`;
    return exp;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={buildCloudinaryUrl(profileImage)}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <CheckCircle className="w-3 h-3 text-white" />
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

            {designation && (
              <p className="text-sm text-black font-medium mb-2">
                {designation}
              </p>
            )}

            {rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">{renderStars(rating)}</div>
                <span className="text-sm font-medium text-gray-900">
                  {rating}
                </span>
                {reviewCount && (
                  <span className="text-sm text-gray-500">
                    ({reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {formatExperience(experience)} yrs
              </span>
            </div>
          </div>
        </div>

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
