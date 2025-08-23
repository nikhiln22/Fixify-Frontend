import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import { IService } from "../../models/service";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import { useNavigate } from "react-router-dom";

interface MostBookedServicesProps {
  services: IService[];
  loading?: boolean;
  error?: string | null;
}

const MostBookedServices: React.FC<MostBookedServicesProps> = ({
  services,
  loading = false,
  error = null,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, services.length - cardsPerView)
        : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= services.length - cardsPerView ? 0 : prevIndex + 1
    );
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/user/servicedetails/${serviceId}`);
    console.log("Service clicked:", serviceId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <h2 className="text-2xl font-bold mb-6">Most Booked Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse max-w-xs mx-auto w-full"
              >
                <div className="w-full h-56 bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <h2 className="text-2xl font-bold mb-6">Most Booked Services</h2>
          <div className="text-center text-red-500 py-12">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl w-full">
          <h2 className="text-2xl font-bold mb-6">Most Booked Services</h2>
          <div className="text-center text-gray-500 py-12">
            <p>No services available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < services.length - cardsPerView;

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Most Booked Services
          </h2>
          <p className="text-gray-600">
            Popular services trusted by our customers
          </p>
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
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {services.map((service) => (
                <div
                  key={service._id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / cardsPerView}%`,
                  }}
                >
                  <Card
                    image={buildCloudinaryUrl(service.image)}
                    title={service.name}
                    price={service.price}
                    type="service"
                    onClick={() => handleServiceClick(service._id)}
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
    </section>
  );
};

export default MostBookedServices;
