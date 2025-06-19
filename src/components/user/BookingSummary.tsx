import React from "react";
import Button from "../common/Button";
import { BookingSummaryProps } from "../../types/component.types";


export const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  onConfirmBooking,
  isLoading = false,
  disabled = false
}) => {
  const serviceCharge = typeof service.price === 'number' 
    ? service.price 
    : parseInt(service.price || '450');

  const totalAmount = serviceCharge;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Booking Summary
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          {service.image && (
            <img 
              src={service.image} 
              alt={service.name || service.designation}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {service.name || service.designation}
            </h3>
            {service.description && (
              <p className="text-sm text-gray-600 mt-1">
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <hr className="my-4" />
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Charge:</span>
          <span className="font-medium">₹{serviceCharge}</span>
        </div>
        
        <hr className="my-2" />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-black">₹{totalAmount}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={onConfirmBooking}
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={disabled || isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
};