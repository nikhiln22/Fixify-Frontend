import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../common/Card';

interface RelatedServicesProps {
  relatedServices?: any[];
  onServiceSelect?: (service: any) => void;
}

const RelatedServices: React.FC<RelatedServicesProps> = ({  
  relatedServices = [], 
  onServiceSelect 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, relatedServices.length - cardsPerView) : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= relatedServices.length - cardsPerView ? 0 : prevIndex + 1
    );
  };

  const handleServiceClick = (service: any) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  if (!relatedServices || relatedServices.length === 0) {
    return null;
  }

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < relatedServices.length - cardsPerView;

  return (
    <div className="py-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Related Services</h3>
        <p className="text-gray-600 text-sm mt-1">You might also need these services</p>
      </div>

      <div className="relative">
        {canGoBack && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Previous services"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="overflow-hidden pb-4">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
            }}
          >
            {relatedServices.map((service, index) => (
              <div 
                key={service._id || index} 
                className="flex-shrink-0 px-3"
                style={{ 
                  width: `${100 / cardsPerView}%`
                }}
              >
                <Card
                  image={service.image}
                  title={service.name}
                  price={service.price}
                  rating={service.rating || 4.5}
                  type="service"
                  onClick={() => handleServiceClick(service)}
                  buttonLabel="Book Now"
                />
              </div>
            ))}
          </div>
        </div>

        {canGoForward && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Next services"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedServices;