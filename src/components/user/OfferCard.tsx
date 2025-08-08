import React from "react";

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  max_discount?: number;
  min_booking_amount: number;
  valid_until: string;
  display_discount: string;
  offer_type?: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
  id,
  title,
  description,
  discount_type,
  discount_value,
  max_discount,
  min_booking_amount,
  valid_until,
  display_discount,
  offer_type = "global",
}) => {
  const getOfferTypeStyle = () => {
    switch (offer_type) {
      case "first_time_user":
        return {
          gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
          badge: "bg-purple-100 text-purple-800",
          badgeText: "First Time Special",
        };
      case "service_category":
        return {
          gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
          badge: "bg-blue-100 text-blue-800",
          badgeText: "Category Offer",
        };
      case "global":
        return {
          gradient: "bg-gradient-to-r from-green-500 to-teal-500",
          badge: "bg-green-100 text-green-800",
          badgeText: "For Everyone",
        };
      default:
        return {
          gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
          badge: "bg-gray-100 text-gray-800",
          badgeText: "Special Offer",
        };
    }
  };

  const formatValidUntil = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = () => {
    return new Date(valid_until) < new Date();
  };

  const styles = getOfferTypeStyle();

  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 max-w-sm mx-auto w-full bg-white ${
        isExpired() ? "opacity-60" : ""
      }`}
    >
      {/* Header with gradient background */}
      <div className={`${styles.gradient} p-6 text-white relative`}>
        <div className="flex justify-between items-start mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}
          >
            {styles.badgeText}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
            {isExpired() ? "Expired" : `Valid till ${formatValidUntil(valid_until)}`}
          </span>
        </div>

        {/* Discount Display */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {discount_type === "percentage"
              ? `${discount_value}%`
              : `₹${discount_value}`}
            <span className="text-lg font-normal ml-2">OFF</span>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Offer Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
            Minimum booking: ₹{min_booking_amount.toLocaleString()}
          </div>
          
          {discount_type === "percentage" && max_discount && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
              Max discount: ₹{max_discount.toLocaleString()}
            </div>
          )}
        </div>

        {/* Informational Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 bg-gray-50 py-2 px-3 rounded-lg">
            {isExpired() ? (
              <span className="text-red-500 font-medium">This offer has expired</span>
            ) : (
              <span>Available during service booking</span>
            )}
          </p>
        </div>
      </div>


    </div>
  );
};

export default OfferCard;