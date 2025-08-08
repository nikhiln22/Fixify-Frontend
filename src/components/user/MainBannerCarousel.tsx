import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MainBannerCarousel = ({ offers = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Create slides array with hero slide + dynamic offers
  const slides = [
    // Hero slide (static)
    {
      id: 'hero',
      type: 'hero',
      title: 'Welcome to Fixify',
      subtitle: 'Your trusted home service partner',
      description: 'Professional plumbing, electrical, and home repair services at your doorstep',
      buttonText: 'Explore Services',
      backgroundImage: '/images/hero-bg.jpg',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    // Dynamic offer slides from API
    ...offers.map((offer, index) => ({
      id: offer._id || `offer-${index}`,
      type: 'offer',
      title: offer.discount_type === 'percentage' 
        ? `${offer.discount_value}% OFF` 
        : `₹${offer.discount_value} OFF`,
      subtitle: offer.title,
      description: offer.description,
      buttonText: 'Book Now',
      offerCode: `SAVE${offer.discount_value}`,
      backgroundColor: '#ffffff', // Clean white background
      offer_type: offer.offer_type,
      valid_until: offer.valid_until,
      min_booking_amount: offer.min_booking_amount
    }))
  ];

  // Auto-advance slides every 5 seconds
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

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  // Helper function to get brand accent color
  const getBrandColor = (offerType) => {
    switch (offerType) {
      case 'service_category':
        return '#3b82f6'; // Blue
      case 'first_time_user':
        return '#10b981'; // Green
      case 'global':
        return '#8b5cf6'; // Purple
      default:
        return '#6366f1'; // Default blue
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
      {/* Main Slide Content */}
      <div 
        className="w-full h-full flex items-center justify-center relative transition-all duration-500 ease-in-out"
        style={{ 
          background: currentSlideData.type === 'hero' 
            ? currentSlideData.backgroundColor 
            : currentSlideData.backgroundColor
        }}
      >
        {/* Background Image Overlay (if hero slide) */}
        {currentSlideData.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${currentSlideData.backgroundImage})` }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl">
          {/* Hero Slide Layout */}
          {currentSlideData.type === 'hero' && (
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
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 mt-6">
                {currentSlideData.buttonText}
              </button>
            </div>
          )}

          {/* Offer Slide Layout - Clean White Design */}
          {currentSlideData.type === 'offer' && (
            <div className="space-y-6 text-gray-800">
              {/* Offer Badge */}
              <div className="inline-block">
                <div 
                  className="text-6xl md:text-8xl font-black mb-2"
                  style={{ color: getBrandColor(currentSlideData.offer_type) }}
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

              {/* Additional offer details */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                {currentSlideData.min_booking_amount && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Min. booking: ₹{currentSlideData.min_booking_amount}
                  </span>
                )}
                {currentSlideData.valid_until && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                    Valid until: {new Date(currentSlideData.valid_until).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {/* Offer Code */}
              {currentSlideData.offerCode && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-6 py-3 inline-block">
                  <span className="text-sm font-medium text-gray-600">Use Code: </span>
                  <span className="text-xl font-bold text-gray-900">{currentSlideData.offerCode}</span>
                </div>
              )}
              
              <button 
                className="px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 mt-6"
                style={{ 
                  backgroundColor: getBrandColor(currentSlideData.offer_type),
                  color: 'white'
                }}
              >
                {currentSlideData.buttonText}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
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

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default MainBannerCarousel;