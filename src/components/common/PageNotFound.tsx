import React from "react";
import { Home, ArrowLeft, Settings, Wrench, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define types for better TypeScript support
type UserRole = "admin" | "technician" | "user";

interface PageNotFoundProps {
  userRole?: UserRole;
  userName?: string;
}

export const PageNotFound: React.FC<PageNotFoundProps> = ({
  userRole = "user",
  userName = "User",
}) => {
  const navigate = useNavigate();

  // Define role-specific configurations with proper typing
  const roleConfig: Record<
    UserRole,
    {
      icon: React.ComponentType<any>;
      color: string;
      bgColor: string;
      buttonColor: string;
      homeRoute: string;
      suggestions: string[];
    }
  > = {
    admin: {
      icon: Settings,
      color: "from-purple-600 to-blue-600",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      homeRoute: "/admin/dashboard",
      suggestions: [
        "Manage user accounts",
        "View system analytics",
        "Configure platform settings",
        "Monitor technician performance",
      ],
    },
    technician: {
      icon: Wrench,
      color: "from-orange-600 to-red-600",
      bgColor: "bg-orange-50",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      homeRoute: "/technician/portal",
      suggestions: [
        "View assigned jobs",
        "Update job status",
        "Manage your profile",
        "Check service history",
      ],
    },
    user: {
      icon: User,
      color: "from-green-600 to-teal-600",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      homeRoute: "/user/home",
      suggestions: [
        "Book a service",
        "Track your requests",
        "View service history",
        "Update your profile",
      ],
    },
  };

  const config = roleConfig[userRole] || roleConfig.user;
  const IconComponent = config.icon;

  const handleGoHome = () => {
    navigate(config.homeRoute);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`min-h-screen ${config.bgColor} flex items-center justify-center px-4`}
    >
      <div className="max-w-2xl w-full text-center">
        {/* Header Section */}
        <div className="mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${config.color} mb-6`}
          >
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Hello {userName}! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGoHome}
            className={`inline-flex items-center px-6 py-3 ${config.buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>

          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Role-specific Suggestions */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What would you like to do instead?
          </h3>
          <ul className="space-y-2 text-left">
            {config.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color} mr-3 flex-shrink-0`}
                ></div>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@fixify.com"
              className={`text-transparent bg-clip-text bg-gradient-to-r ${config.color} hover:underline`}
            >
              support@fixify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
