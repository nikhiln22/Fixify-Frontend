import React, { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import useLogout from "../../hooks/useLogout";
import Modal from "./Modal";

interface UserDropdownProps {
  role: "user" | "technician" | "admin";
}

export const Dropdown: React.FC<UserDropdownProps> = ({ role }) => {
  const logout = useLogout();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Get data based on role
  const userData = useAppSelector((state) => state.user.userData);
  const technicianData = useAppSelector(
    (state) => state.technician.technicianData
  );
  const adminData = useAppSelector((state) => state.admin.adminData);

  const getCurrentUserData = () => {
    switch (role) {
      case "user":
        return {
          username: userData?.username || "User",
          email: userData?.email || "",
          image: userData?.image,
          isVerified: true, // Users don't have verification
        };
      case "technician":
        return {
          username: technicianData?.username || "Technician",
          email: technicianData?.email || "",
          image: technicianData?.image,
          isVerified: technicianData?.is_verified || false,
        };
      case "admin":
        return {
          username: "Admin",
          email: adminData?.email || "admin@fixify.com",
          image: null, // Admin doesn't have image
          isVerified: true, // Admin is always "verified"
        };
      default:
        return {
          username: "User",
          email: "",
          image: null,
          isVerified: true,
        };
    }
  };

  const getProfileLink = () => {
    switch (role) {
      case "user":
        return "/user/profile";
      case "technician":
        return "/technician/profile";
      case "admin":
        return null; // Admin doesn't have profile
      default:
        return null;
    }
  };

  const currentUser = getCurrentUserData();
  const profileLink = getProfileLink();

  const handleLogoutClick = () => {
    setIsUserDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center focus:outline-none overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-all duration-200"
        >
          {currentUser.image ? (
            <img
              src={buildCloudinaryUrl(currentUser.image)}
              alt={currentUser.username}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </button>

        {isUserDropdownOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black/5 focus:outline-none z-10 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center overflow-hidden mr-3">
                  {currentUser.image ? (
                    <img
                      src={buildCloudinaryUrl(currentUser.image)}
                      alt={currentUser.username}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.username}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  {/* Show verification status for technician */}
                  {role === "technician" && (
                    <p
                      className={`text-xs font-medium ${
                        currentUser.isVerified
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {currentUser.isVerified
                        ? "Verified"
                        : "Pending Verification"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile link - only for user and technician */}
            {profileLink && (
              <Link
                to={profileLink}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                My Profile
              </Link>
            )}

            <div className="border-t border-gray-100 mt-1"></div>
            <a
              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
              onClick={handleLogoutClick}
            >
              Sign out
            </a>
          </div>
        )}
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        title="Confirm Logout"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        confirmButtonColor="red"
        className="max-w-md"
      >
        Are you sure you want to logout?
      </Modal>
    </>
  );
};
