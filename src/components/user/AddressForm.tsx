import React, { useState, useEffect } from "react";
import { MapPin, Home, Building2 } from "lucide-react";
import Button from "../common/Button";
import InputField from "../common/InputField";
import { useOlaMap } from "../../hooks/useOlaMap";
import { MapLocation } from "../../types/map.types";
import { IAddress } from "../../models/address";
import { AddressFormProps } from "../../types/component.types";

interface FormData {
  addressType: "Home" | "Work";
  houseNumber: string;
  landmark?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  mode,
  initialData,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    addressType: "Home",
    houseNumber: "",
    landmark: "",
    fullAddress: "",
    latitude: undefined,
    longitude: undefined,
  });

  const {
    location,
    isLoadingLocation,
    locationError,
    mapContainerRef,
    getCurrentLocation,
    isMapReady,
  } = useOlaMap({
    onLocationChange: (newLocation: MapLocation) => {
      console.log("Map location changed:", newLocation);
      setFormData((prev) => ({
        ...prev,
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        fullAddress: newLocation.address || "",
      }));
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        addressType: initialData.addressType,
        houseNumber: initialData.houseNumber || "",
        landmark: initialData.landmark || "",
        fullAddress: initialData.fullAddress || "",
        latitude: initialData.latitude,
        longitude: initialData.longitude,
      });
    } else {
      setFormData({
        addressType: "Home",
        houseNumber: "",
        landmark: "",
        fullAddress: "",
        latitude: undefined,
        longitude: undefined,
      });
    }
  }, [mode, initialData, isOpen]);

  useEffect(() => {
    if (location) {
      console.log("Location from map hook:", location);
      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        fullAddress: location.address || "",
      }));
    }
  }, [location]);

  const addressTypes = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Work", label: "Work", icon: Building2 },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (addressType: "Home" | "Work") => {
    setFormData((prev) => ({
      ...prev,
      addressType,
    }));
  };

  const handleSave = () => {
    console.log("AddressForm - handleSave called with:", formData);
    
    if (!formData.fullAddress || !formData.houseNumber) {
      alert("Please select a location and enter house/flat details");
      return;
    }

    if (formData.latitude === undefined || formData.longitude === undefined) {
      alert("Please select a location on the map");
      return;
    }

    const addressData: Partial<IAddress> = {
      addressType: formData.addressType,
      houseNumber: formData.houseNumber,
      landmark: formData.landmark,
      fullAddress: formData.fullAddress,
      latitude: formData.latitude,
      longitude: formData.longitude,
      ...(mode === "edit" && initialData?._id && { _id: initialData._id }),
    };

    console.log("Sending address data:", addressData);
    onSave(addressData);
  };

  const handleCancel = () => {
    setFormData({
      addressType: "Home",
      houseNumber: "",
      landmark: "",
      fullAddress: "",
      latitude: undefined,
      longitude: undefined,
    });
    onClose();
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">
          {mode === "add" ? "Add New Address" : "Edit Address"}
        </h4>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Address Type
        </label>
        <div className="flex gap-3">
          {addressTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id as "Home" | "Work")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.addressType === type.id
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center text-black hover:text-gray-700 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-100 px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <MapPin className="w-4 h-4 mr-2" />
          <span>
            {isLoadingLocation ? "Getting Location..." : "Use current location"}
          </span>
        </button>

        {location && (
          <div className="space-y-4 mb-4">
            <div
              ref={mapContainerRef}
              id="ola-map-container"
              className="w-full rounded-lg border border-gray-300 relative overflow-hidden shadow-sm"
              style={{ height: "280px", minHeight: "280px" }}
            >
              {!isMapReady && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    Loading map...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Location:
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    {formData.fullAddress ||
                      location.address ||
                      `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {formData.latitude?.toFixed(6) || location.latitude.toFixed(6)},{" "}
                    {formData.longitude?.toFixed(6) || location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {locationError && (
          <p className="text-red-500 text-xs mt-2">{locationError}</p>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <InputField
            label="House/Flat/Block Number"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={(e) => handleInputChange("houseNumber", e.target.value)}
            placeholder="Enter house/flat/block number"
            type="text"
            required
          />
        </div>
        <div className="flex-1">
          <InputField
            label="Landmark (Optional)"
            name="landmark"
            value={formData.landmark || ""}
            onChange={(e) => handleInputChange("landmark", e.target.value)}
            placeholder="Enter nearby landmark"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          className="px-6 py-3"
          disabled={isLoadingLocation || !formData.fullAddress || !formData.houseNumber}
        >
          {mode === "add" ? "Save Address" : "Update Address"}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="px-6 py-3">
          Cancel
        </Button>
      </div>
    </div>
  );
};