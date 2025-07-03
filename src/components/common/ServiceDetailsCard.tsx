import React from "react";
import { ImageIcon } from "lucide-react";

interface ServiceDetailsCardProps {
  serviceName?: string;
  description?: string;
  servicePrice?: number;
  totalAmount: number;
  serviceImage?: string;
  className?: string;
}

export const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({
  serviceName,
  description,
  servicePrice,
  totalAmount,
  serviceImage,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm  p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
      </div>

      <div className="flex gap-4 mb-6">
        {serviceImage && (
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
              <img
                src={serviceImage}
                alt="Service"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
              <div
                className="absolute inset-0 bg-gray-100items-center justify-center hidden"
                style={{ display: "none" }}
              >
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2">
            <h3 className="font-medium text-gray-900">
              {serviceName || "N/A"}
            </h3>
          </div>
          {description && (
            <div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Service Charge:
          </span>
          <span className="font-medium">₹{servicePrice || "N/A"}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Amount:
          </span>
          <span className="font-semibold text-lg">₹{totalAmount}</span>
        </div>
      </div>
    </div>
  );
};
