import React from "react";
import { HelpCircle, Info, Copyright } from "lucide-react";

export const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "v1.2.0";

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-sm text-gray-600">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-3 md:mb-0 flex items-center">
          <Copyright className="w-4 h-4 mr-1 text-gray-500" />
          <span className="font-medium">
            {currentYear}{" "}
            <span className="text-gray-800 font-semibold">Fixify</span> Admin
            Portal. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <span className="text-gray-500 font-medium">
              Version: <span className="text-gray-700">{appVersion}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/admin/help"
              className="flex items-center gap-1 hover:text-gray-800 transition-colors font-medium"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </a>

            <a
              href="/admin/support"
              className="flex items-center gap-1 hover:text-gray-800 transition-colors font-medium"
            >
              <Info className="w-4 h-4" />
              <span>Support</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
