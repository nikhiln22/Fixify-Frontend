import React from 'react';

export type PaymentMethod = "Cash" | "online" | "Wallet";

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  onPaymentMethodSelect,
  disabled = false,
  className = ""
}) => {
  const paymentOptions: PaymentOption[] = [
    {
      id: "Cash",
      name: "Cash on Delivery",
      description: "Pay with cash when service is completed",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
        </svg>
      )
    },
    {
      id: "online",
      name: "Online Payment",
      description: "Pay securely with card or UPI",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: "Wallet",
      name: "Wallet Payment",
      description: "Pay using your wallet balance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m3 18l3-3m-3 3l-3-3" />
        </svg>
      )
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
                : 'cursor-pointer hover:border-gray-300'
            } ${
              selectedPaymentMethod === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => handlePaymentSelect(option.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg transition-colors ${
                selectedPaymentMethod === option.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium transition-colors ${
                    selectedPaymentMethod === option.id
                      ? 'text-blue-900'
                      : 'text-gray-900'
                  }`}>
                    {option.name}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPaymentMethod === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === option.id && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className={`text-sm mt-1 transition-colors ${
                  selectedPaymentMethod === option.id
                    ? 'text-blue-700'
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