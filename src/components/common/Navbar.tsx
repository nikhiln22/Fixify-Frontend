import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Fixify</h1>
      <div className="space-x-4">
        <a href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </a>
        <a href="/about" className="text-gray-700 hover:text-blue-600">
          About
        </a>
        <a href="/contact" className="text-gray-700 hover:text-blue-600">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
