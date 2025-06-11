import React from "react";
import { Edit, Home, Building2, Trash2 } from "lucide-react";
import Button from "../common/Button";
import { IAddress } from "../../models/address";

export interface AddressCardProps {
  address: IAddress;
  onEdit?: (address: IAddress) => void;
  onDelete?: (addressId: string) => void;
  showActions?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const getAddressIcon = (type: "Home" | "Work") => {
    switch (type) {
      case "Home":
        return Home;
      case "Work":
        return Building2;
      default:
        return Home;
    }
  };

  const IconComponent = getAddressIcon(address.addressType);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(address);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(address._id);
    }
  };

  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
        <IconComponent className="w-5 h-5 text-black" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-900 capitalize">
            {address.addressType}
          </h4>

          {showActions && (onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="px-4 py-2 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="px-4 py-2 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">{address.fullAddress}</p>

        {address.houseNumber && (
          <p className="text-sm text-gray-500 mt-1">
            House/Flat: {address.houseNumber}
          </p>
        )}
      </div>
    </div>
  );
};