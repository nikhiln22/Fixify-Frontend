import React, { useState, useRef, useEffect } from "react";
import { UserCircle, Bell, LogOut, User } from "lucide-react";
import useLogout from "../../hooks/useLogout";
import Modal from "../common/Modal";

const AdminNavbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logout = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowDropdown(false);
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
      <header className="bg-white w-full px-6 py-4 flex justify-between items-center border-b border-gray-100 z-10 relative">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">FIXIFY</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200"
              title="Profile"
            >
              <UserCircle size={30} className="text-gray-800" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-20">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Signout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
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

export default AdminNavbar;
