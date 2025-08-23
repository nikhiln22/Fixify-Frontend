import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IOffer } from "../../models/offer";

interface MainBannerCarouselProps {
  offers?: IOffer[];
  loading?: boolean;
  error?: string | null;
}

export const MainBannerCarousel: React.FC<MainBannerCarouselProps> = ({
  offers = [],
  loading = false,
  error = null,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "hero",
      type: "hero" as const,
      title: "Welcome to Fixify",
      subtitle: "Your trusted home service partner",
      description:
        "Professional plumbing, electrical, and home repair services at your doorstep",
      buttonText: "Explore Services",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },

    ...offers.map((offer, index) => ({
      id: offer._id || `offer-${index}`,
      type: "offer" as const,
      title:
        offer.discount_type === "percentage"
          ? `${offer.discount_value}% OFF`
          : `₹${offer.discount_value} OFF`,
      subtitle: offer.title,
      description: offer.description,
      offerCode: `SAVE${offer.discount_value}`,
      backgroundColor: "#ffffff",
      offer_type: offer.offer_type,
      min_booking_amount: offer.min_booking_amount,
    })),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  const getBrandColor = (offerType?: string) => {
    if (!offerType) return "#6366f1";

    switch (offerType) {
      case "service_category":
        return "#3b82f6";
      case "first_time_user":
        return "#10b981";
      case "global":
        return "#8b5cf6";
      default:
        return "#6366f1";
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg bg-gray-200 animate-pulse">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
        <div
          className="w-full h-full flex items-center justify-center relative transition-all duration-500 ease-in-out"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl">
            <div className="space-y-4 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to Fixify
              </h1>
              <h2 className="text-xl md:text-2xl font-medium opacity-90">
                Your trusted home service partner
              </h2>
              <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                Professional plumbing, electrical, and home repair services at
                your doorstep
              </p>
              <p className="text-sm text-red-300 mt-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
      <div
        className="w-full h-full flex items-center justify-center relative transition-all duration-500 ease-in-out"
        style={{
          background:
            currentSlideData.type === "hero"
              ? currentSlideData.backgroundColor
              : currentSlideData.backgroundColor,
        }}
      >
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl">
          {currentSlideData.type === "hero" && (
            <div className="space-y-4 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {currentSlideData.title}
              </h1>
              <h2 className="text-xl md:text-2xl font-medium opacity-90">
                {currentSlideData.subtitle}
              </h2>
              <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                {currentSlideData.description}
              </p>
            </div>
          )}

          {currentSlideData.type === "offer" && (
            <div className="space-y-6 text-gray-800">
              <div className="inline-block">
                <div
                  className="text-6xl md:text-8xl font-black mb-2"
                  style={{
                    color: getBrandColor((currentSlideData as any).offer_type),
                  }}
                >
                  {currentSlideData.title}
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                {currentSlideData.subtitle}
              </h2>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {currentSlideData.description}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                {(currentSlideData as any).min_booking_amount && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Min. booking: ₹
                    {(currentSlideData as any).min_booking_amount}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
