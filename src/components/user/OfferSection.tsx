import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OfferCard from "./OfferCard";

interface OfferData {
  title: string;
  description: string;
  offer_type?: string;
  discount_type: string;
  discount_value: number;
  max_discount?: number;
  min_booking_amount: number;
  valid_until: string;
  display_discount: string;
}

interface OffersSectionProps {
  offers: OfferData[];
  loading?: boolean;
}

const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  loading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3; // Show 3 offers at a time on desktop

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, offers.length - cardsPerView)
        : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= offers.length - cardsPerView ? 0 : prevIndex + 1
    );
  };


  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
            <p className="text-gray-600">Save more on your favorite services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-80 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
            <p className="text-gray-600">Save more on your favorite services</p>
          </div>
          <div className="text-center text-gray-500 py-12">
            <p>No offers available at the moment.</p>
            <p className="text-sm mt-2">Check back soon for exciting deals!</p>
          </div>
        </div>
      </section>
    );
  }

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < offers.length - cardsPerView;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl w-full">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
          <p className="text-gray-600">Save more on your favorite services</p>
        </div>

        {/* Offers Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {offers.map((offer, index) => (
                <div
                  key={`offer-${index}`}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / cardsPerView}%`,
                  }}
                >
                  <OfferCard
                    id={`offer-${index}`}
                    title={offer.title}
                    description={offer.description}
                    discount_type={offer.discount_type}
                    discount_value={offer.discount_value}
                    max_discount={offer.max_discount}
                    min_booking_amount={offer.min_booking_amount}
                    valid_until={offer.valid_until}
                    display_discount={offer.display_discount}
                    offer_type={offer.offer_type || "global"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - only show if there are more offers than visible */}
          {offers.length > cardsPerView && (
            <>
              {canGoBack && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl"
                  aria-label="Previous offers"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {canGoForward && (
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl"
                  aria-label="Next offers"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Optional: Show current position indicator */}
        {offers.length > cardsPerView && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(offers.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / cardsPerView) === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OffersSection;