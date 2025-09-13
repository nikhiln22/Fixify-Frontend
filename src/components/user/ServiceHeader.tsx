import React from "react";
import { Clock } from "lucide-react";
import { IService } from "../../models/service";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";

const ServiceHeader: React.FC<{ service: IService | null }> = ({ service }) => {
  if (!service) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  const formatEstimatedTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} mins`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} mins`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
            {service.image ? (
              <img
                src={buildCloudinaryUrl(service.image)}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <span>Service Image</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {service.name}
          </h1>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {service.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {service.serviceType === "fixed"
                  ? "Fixed Price"
                  : "Hourly Service"}
              </span>
            </div>

            {service.serviceType === "fixed" ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  ₹{service.price}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    ₹{service.hourlyRate}/hr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Estimated Time */}
          {service.estimatedTime && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">
                  Estimated Duration:{" "}
                  <span className="text-gray-600">
                    {formatEstimatedTime(service.estimatedTime)}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Service Features */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                ✓ Professional Service
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                ✓ Same Day Available
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                ✓ Warranty Included
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
