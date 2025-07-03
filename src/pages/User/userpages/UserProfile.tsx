import React, { useState, useEffect } from "react";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import { ProfileCard } from "../../../components/common/ProfileCard";
import { AddressManager } from "../../../components/user/AddressManager";
import { getUserProfile, editProfile } from "../../../services/user.services";
import {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} from "../../../services/user.services";
import { Iuser } from "../../../models/user";
import { IAddress } from "../../../models/address";
import { updateUserData } from "../../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { showToast } from "../../../utils/toast";

export const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<Iuser | null>(null);
  const [userAddresses, setUserAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.user) {
          setUserData(response.user);
          await fetchUserAddresses();
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        showToast({
          message: "Failed to load user profile",
          type: "error",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const addresses = await getUserAddresses();
      console.log("address fetched in the userprofile component:", addresses);

      setUserAddresses(addresses.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showToast({
        message: "Failed to load addresses",
        type: "error",
      });
      setUserAddresses([]);
    }
  };

  const handleProfileSave = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const response = await editProfile(formData);
      console.log("Profile updated successfully:", response);

      if (response && userData) {
        setUserData((prevUserData) => ({
          ...prevUserData!,
          username: response.username || prevUserData!.username,
          phone: response.phone || prevUserData!.phone,
          image:
            response.image !== undefined ? response.image : prevUserData!.image,
        }));

        const updatedUserData = {
          username: response.username || userData.username,
          phone: response.phone || userData.phone,
          image: response.image !== undefined ? response.image : userData.image,
        };

        dispatch(updateUserData(updatedUserData));

        showToast({
          message: "Profile updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        message: "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSave = async (addressData: Partial<IAddress>) => {
    try {
      console.log("UserProfile - handleAddressSave called with:", addressData);

      const dataToSend = {
        addressType: addressData.addressType || "Home",
        fullAddress: addressData.fullAddress || "",
        houseNumber: addressData.houseNumber,
        longitude: addressData.longitude || 0,
        latitude: addressData.latitude || 0,
        landmark: addressData.landmark,
      };

      console.log("Data being sent to API:", dataToSend);

      if (addressData._id) {
        const response = await updateAddress(addressData._id, dataToSend);
        if (response.success) {
          setUserAddresses((prev) =>
            prev.map((addr) =>
              addr._id === addressData._id
                ? ({ ...addr, ...response.data } as IAddress)
                : addr
            )
          );

          showToast({
            message: "Address updated successfully",
            type: "success",
          });
          return response.data;
        }
      } else {
        console.log("adding new address");
        const response = await addAddress(dataToSend);
        if (response.success) {
          if (response.data) {
            setUserAddresses((prev) => [...prev, response.data as IAddress]);
          }

          showToast({
            message: "Address added successfully",
            type: "success",
          });
          return response.data;
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast({
        message: "Failed to save address",
        type: "error",
      });
      throw error;
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    try {
      const response = await deleteAddress(addressId);
      if (response.success) {
        setUserAddresses((prev) =>
          prev.filter((addr) => addr._id !== addressId)
        );

        showToast({
          message: "Address deleted successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast({
        message: "Failed to delete address",
        type: "error",
      });
      throw error;
    }
  };

  const handleAddressChange = (addresses: IAddress[]) => {
    setUserAddresses(addresses);
    console.log("User addresses updated:", addresses);
  };

  return (
    <UserLayout>
      <div className="flex h-full">
        <UserProfileSidebar />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">
              Manage your profile information and addresses
            </p>
          </div>

          <div className="space-y-8">
            {userData && (
              <ProfileCard
                name={userData.username}
                email={userData.email}
                phone={userData.phone}
                image={userData.image}
                role="user"
                isEditable={true}
                onSave={handleProfileSave}
              />
            )}

            <AddressManager
              userId={userData?._id || userData?.username}
              addresses={userAddresses}
              onAddressChange={handleAddressChange}
              onAddressSave={handleAddressSave}
              onAddressDelete={handleAddressDelete}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};