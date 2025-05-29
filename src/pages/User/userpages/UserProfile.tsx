import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Home } from "lucide-react";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import UserProfileCard from "../../../components/technician/TechnicianProfileCard";
import Button from "../../../components/common/Button";
import { getUserProfile } from "../../../services/user.services";
import { Iuser } from "../../../models/user";

export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<Iuser | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    house: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        console.log("response from the user profile:", response);
        if (response.user) {
          setUserData(response.user);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    console.log("Edit button clicked");
  };

  const handleAddAddress = () => {
    setShowAddAddressForm(true);
  };

  const handleAddressInputChange = (field: string, value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = () => {
    console.log("Address saved:", addressForm);
    setShowAddAddressForm(false);
    setAddressForm({ house: "", city: "", state: "" });
  };

  const handleCancelAddress = () => {
    setShowAddAddressForm(false);
    setAddressForm({ house: "", city: "", state: "" });
  };

  const handleUseCurrentLocation = () => {
    console.log("Using current location");
  };

  return (
    <UserLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-12 pl-42">
          <UserProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-68 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <Button
                variant="primary"
                onClick={handleEditClick}
                className="px-8 py-3 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>

            {userData && (
              <UserProfileCard
                name={userData.username}
                email={userData.email}
                phone={userData.phone}
                profilePhoto={userData.image}
              />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-black" />
                    Addresses
                  </h3>
                  {!showAddAddressForm && (
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
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Addresses
                  </h4>
                  <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                      <Home className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">Home</h4>
                        <Button
                          variant="ghost"
                          className="text-black hover:text-gray-700 text-sm font-medium p-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        Koby layout first layout Sector 2, Bengaluru, Karnataka
                        560012
                      </p>
                    </div>
                  </div>
                </div>

                {showAddAddressForm && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Add New Address
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          House/Flat/Block
                        </label>
                        <input
                          type="text"
                          value={addressForm.house}
                          onChange={(e) =>
                            handleAddressInputChange("house", e.target.value)
                          }
                          placeholder="Enter house/flat/block number"
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) =>
                              handleAddressInputChange("city", e.target.value)
                            }
                            placeholder="Enter city"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) =>
                              handleAddressInputChange("state", e.target.value)
                            }
                            placeholder="Enter state"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleUseCurrentLocation}
                      className="mt-4 flex items-center text-black hover:text-gray-700 text-sm font-medium cursor-pointer transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Use current location</span>
                    </button>

                    <div className="flex items-center gap-3 mt-6">
                      <Button
                        variant="primary"
                        onClick={handleSaveAddress}
                        className="px-6 py-3"
                      >
                        Save Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelAddress}
                        className="px-6 py-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
