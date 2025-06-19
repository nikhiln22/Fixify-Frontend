import React from 'react';
import { CreditCard, Wallet, Check } from "lucide-react"
import { PaymentMethodSelectorProps } from '../../types/component.types';
import { PaymentOption } from '../../types/component.types';

export type PaymentMethod = "Online" | "Wallet";

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  onPaymentMethodSelect,
  disabled = false,
  className = ""
}) => {
  const paymentOptions: PaymentOption[] = [
    {
      id: "Online",
      name: "Online Payment",
      description: "Pay securely with card or UPI",
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: "Wallet",
      name: "Wallet Payment",
      description: "Pay using your wallet balance",
      icon: <Wallet className="w-6 h-6" />
    }
  ];

  const handlePaymentSelect = (method: PaymentMethod) => {
    if (!disabled) {
      onPaymentMethodSelect(method);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Payment Method
      </h2>
      
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`border-2 rounded-lg p-4 transition-all duration-200 ${
              disabled 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer hover:border-gray-400'
            } ${
              selectedPaymentMethod === option.id
                ? 'border-black bg-gray-50'
                : 'border-gray-200'
            }`}
            onClick={() => handlePaymentSelect(option.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg transition-colors ${
                selectedPaymentMethod === option.id
                  ? 'bg-gray-200 text-black'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium transition-colors ${
                    selectedPaymentMethod === option.id
                      ? 'text-black'
                      : 'text-gray-900'
                  }`}>
                    {option.name}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPaymentMethod === option.id
                      ? 'border-black bg-black'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <p className={`text-sm mt-1 transition-colors ${
                  selectedPaymentMethod === option.id
                    ? 'text-gray-700'
                    : 'text-gray-600'
                }`}>
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};