import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Bell, Search } from "lucide-react";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token/cookie here
    navigate("/admin/login");
  };

  return (
    <header className="bg-white w-full px-6 py-4 flex justify-between items-center border-b border-gray-100 z-10 relative">
      <div className="flex items-center">
        {/* Company Logo */}
        <h1 className="text-2xl font-bold text-gray-800">FIXIFY</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search box */}
        <div className="hidden md:flex items-center relative bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
          <Search size={18} className="text-gray-700 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm w-40"
          />
        </div>

        {/* Notification Bell */}
        <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Icon with dark color */}
        <button
          onClick={handleLogout}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200"
          title="Logout"
        >
          <UserCircle size={30} className="text-gray-800" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
