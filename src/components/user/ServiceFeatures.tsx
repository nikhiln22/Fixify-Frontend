import React from 'react';
import { BadgeCheck, Wallet, MessageCircle } from 'lucide-react';

export const ServiceFeatures:React.FC = ({ className = "" }) => {
  const features = [
    {
      id: 1,
      icon: <BadgeCheck className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      title: "Quality Assured",
      description: "All our technicians are verified and trained professionals"
    },
    {
      id: 2,
      icon: <Wallet className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100",
      title: "Best Prices",
      description: "Transparent pricing with no hidden charges"
    },
    {
      id: 3,
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100",
      title: "24/7 Support",
      description: "Round the clock customer support for your queries"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature) => (
        <div key={feature.id} className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {feature.icon}
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};