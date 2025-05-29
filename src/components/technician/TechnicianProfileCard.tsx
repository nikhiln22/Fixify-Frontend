import React from "react";
import { MapPin } from "lucide-react";
import { TechnicianProfileCardProps } from "../../types/component.types";

const TechnicianProfileCard: React.FC<TechnicianProfileCardProps> = ({
  name,
  email,
  phone,
  Designation,
  yearsOfExperience,
  profilePhoto,
  address,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden w-full">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 mr-8">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={`${name}'s profile`}
                className="w-40 h-48 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-40 h-48 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {name}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 text-base w-32">Email:</span>
                <span className="text-gray-800 text-base font-medium">
                  {email}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 text-base w-32">Phone no:</span>
                <span className="text-gray-800 text-base font-medium">
                  {phone}
                </span>
              </div>
              {yearsOfExperience && (
                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">
                    Experience:
                  </span>
                  <span className="text-gray-800 text-base font-medium">
                    {yearsOfExperience} years
                  </span>
                </div>
              )}
              {Designation && (
                <div className="flex items-center">
                  <span className="text-gray-500 text-base w-32">
                    Designation:
                  </span>
                  <span className="text-gray-800 text-base font-medium">
                    {Designation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {address && (
            <div className="flex-shrink-0 flex flex-col items-center ml-8">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-base text-gray-700 font-medium whitespace-nowrap">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileCard;
