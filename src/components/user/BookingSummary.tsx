import React, { useEffect } from "react";
import Button from "../common/Button";
import { PaymentMethod } from "./PaymentMethodSelector";

interface BookingSummaryProps {
  service: {
    image?: string;
    name?: string;
    designation?: string;
    description?: string;
    price?: string | number;
  };
  onConfirmBooking: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  selectedPaymentMethod?: PaymentMethod | null;
  onTotalAmountChange?: (amount: number) => void; 
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  onConfirmBooking,
  isLoading = false,
  disabled = false,
  selectedPaymentMethod,
  onTotalAmountChange
}) => {
  const serviceCharge = typeof service.price === 'number' 
    ? service.price 
    : parseInt(service.price || '450');
  const platformFee = 50;
  const totalAmount = Math.round(serviceCharge + platformFee);

  useEffect(() => {
    if (onTotalAmountChange) {
      onTotalAmountChange(totalAmount);
    }
  }, [totalAmount, onTotalAmountChange]);

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
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee:</span>
          <span className="font-medium">₹{platformFee}</span>
        </div>
        
        {selectedPaymentMethod && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-blue-600">{selectedPaymentMethod}</span>
          </div>
        )}
        
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
          {disabled ? 'Complete Selection' : isLoading ? 'Processing...' : 'Confirm Booking'}
        </Button>
        
        {disabled && (
          <p className="text-sm text-gray-500 text-center">
            Please select time slot and payment method
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            Verified Technician
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            Secure Payment
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            Money Back Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};