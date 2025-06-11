import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import {IAddress} from "../../models/address"

interface AddressSelectorProps {
  onAddressSelect: (address: IAddress) => void;
  selectedAddress:IAddress | null;
  addresses:IAddress[];
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ 
  onAddressSelect, 
  selectedAddress, 
  addresses = [] 
}) => {
  const [selected, setSelected] = useState<IAddress | null>(selectedAddress);

  useEffect(() => {
    if (onAddressSelect && selected) {
      onAddressSelect(selected);
    }
  }, [selected, onAddressSelect]);

  if (addresses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <MapPin className="text-gray-600" size={20} />
            Service Address
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          <MapPin className="text-gray-600" size={20} />
          Service Address
        </h3>
        <button
          onClick={() => {
            console.log('Add new address clicked');
          }}
          className="text-gray-600 hover:text-black flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selected?._id === address._id
                ? 'border-gray-400 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelected(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {address.addressType}
                  </span>
                </div>
                <p className="text-black font-medium mb-1">{address.fullAddress}</p>
                {address.landmark && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Landmark:</span> {address.landmark}
                  </p>
                )}
              </div>
            </div>
            
            {selected?._id === address._id && (
              <div className="mt-2 pt-2 border-t border-gray-300">
                <div className="flex items-center text-gray-600 text-sm">
                  <Check size={16} className="mr-1" />
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressSelector;