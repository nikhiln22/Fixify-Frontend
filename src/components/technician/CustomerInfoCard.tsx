import React from "react";
import { Phone, Mail, User } from "lucide-react";

interface CustomerInfoCardProps {
  name: string;
  phone: string;
  email: string;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  name,
  phone,
  email,
}) => {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Name</p>
            <p className="font-medium text-gray-900">{name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium text-gray-900">{phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-full">
            <Mail className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
