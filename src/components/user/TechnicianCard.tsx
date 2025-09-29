import React from "react";
import { Star, Briefcase } from "lucide-react";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import Button from "../common/Button";
import { Itechnician } from "../../models/technician";

interface TechnicianCardProps {
  technician: Itechnician & { averageRating: number };
  onSelect?: () => void;
  showBookButton?: boolean;
  isSelected?: boolean;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onSelect,
  showBookButton = true,
}) => {
  const { username, averageRating, yearsOfExperience } = technician;

  const renderStars = (rating: number) => {
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

  const formatExperience = (exp: number | undefined) => {
    return `${exp ?? 0}`;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={
                technician.image ? buildCloudinaryUrl(technician.image) : "N/A"
              }
              alt={username}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {username}
              </h3>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(averageRating)}
              </div>
              {averageRating > 0 ? (
                <span className="text-sm font-medium text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              ) : (
                <span className="text-sm text-gray-500">No reviews yet</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {formatExperience(yearsOfExperience)} years of experience
              </span>
            </div>
          </div>
        </div>

        {showBookButton && onSelect && (
          <div className="flex gap-2 w-full lg:w-auto">
            <Button
              onClick={onSelect}
              variant="primary"
              className="flex-1 lg:flex-none"
            >
              Select
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianCard;
