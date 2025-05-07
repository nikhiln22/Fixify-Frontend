import React from "react";
import { MapPin } from "lucide-react";

interface TechnicianProfileCardProps {
  name: string;
  email: string;
  phone: number;
  Designation: string;
  yearsOfExperience: number;
  profilePhoto?: string | null;
  location?: string;
}

const TechnicianProfileCard: React.FC<TechnicianProfileCardProps> = ({
  name,
  email,
  phone,
  Designation,
  yearsOfExperience,
  profilePhoto,
  location = "HSR Layout, Bengaluru"
}) => {
  return (
    <div className="bg-gray-100 rounded-3xl shadow-md overflow-hidden h-64">
      <div className="p-6 h-full">
        {/* Profile Information Container */}
        <div className="flex items-start h-full">
          {/* Left side - Profile Photo */}
          <div className="mr-8">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt={`${name}'s profile`} 
                className="w-36 h-44 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-36 h-44 rounded-lg bg-white flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Middle - Personal Details */}
          <div className="flex-grow pt-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{name}</h3>
            <p className="text-gray-600 text-sm my-2">Email : {email}</p>
            <p className="text-gray-600 text-sm my-2">Phone no : {phone}</p>
            <p className="text-gray-600 text-sm my-2">Year of Experience : {yearsOfExperience} years</p>
            <p className="text-gray-600 text-sm my-2">Designation : {department}</p>
          </div>
          
          {/* Right side - Location Button */}
          <div className="self-center flex flex-col items-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-3">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs text-center">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileCard;