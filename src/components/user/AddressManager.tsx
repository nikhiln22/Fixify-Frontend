import React, { useState, useEffect } from "react";
import { MapPin, Plus } from "lucide-react";
import Button from "../common/Button";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { IAddress } from "../../models/address";
import { AddressManagerProps } from "../../types/component.types";

export const AddressManager: React.FC<AddressManagerProps> = ({
  userId,
  addresses = [],
  onAddressChange,
  onAddressSave,
  onAddressDelete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingAddress, setEditingAddress] = useState<IAddress | undefined>();

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(addresses);
    }
  }, [addresses, onAddressChange]);

  const handleAddAddress = () => {
    setFormMode("add");
    setEditingAddress(undefined);
    setShowForm(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setFormMode("edit");
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (onAddressDelete) {
        await onAddressDelete(addressId);
      }
      console.log("Address deleted successfully");
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSaveAddress = async (addressData: Partial<IAddress>) => {
    try {
      console.log(
        "AddressManager - handleSaveAddress called with:",
        addressData
      );

      const backendData: Partial<IAddress> = {
        addressType: addressData.addressType,
        fullAddress: addressData.fullAddress,
        houseNumber: addressData.houseNumber,
        landmark: addressData.landmark,
        latitude: addressData.latitude!,
        longitude: addressData.longitude!,
        userId: userId,
        ...(formMode === "edit" &&
          editingAddress?._id && { _id: editingAddress._id }),
      };

      console.log("Sending to backend:", backendData);

      if (onAddressSave) {
        await onAddressSave(backendData);
      }

      handleCloseForm();
      console.log(
        `Address ${formMode === "add" ? "added" : "updated"} successfully`
      );
    } catch (err) {
      console.error(
        `Error ${formMode === "add" ? "adding" : "updating"} address:`,
        err
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(undefined);
    setFormMode("add");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-black" />
            Addresses
          </h3>
          {!showForm && addresses.length > 0 && (
            <Button
              variant="outline"
              onClick={handleAddAddress}
              className="px-4 py-2 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">

        {!showForm && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Your Addresses
            </h4>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Add your home and work addresses for faster service bookings</p>
                <Button
                  variant="primary"
                  onClick={handleAddAddress}
                  className="px-6 py-3"
                >
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {showForm && (
          <AddressForm
            isOpen={showForm}
            mode={formMode}
            initialData={editingAddress}
            onSave={handleSaveAddress}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
};