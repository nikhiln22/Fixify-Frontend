import React, { memo } from "react";
import TechnicianCard from "./TechncianCard";
import { Itechnician } from "../../models/technician";
import { IAddress } from "../../models/address";

interface TechnicianListProps {
  serviceId?: string;
  selectedAddress: IAddress | null;
  onTechnicianSelect: (
    technician: Itechnician & { averageRating: number }
  ) => void;
  technicians: (Itechnician & { averageRating: number })[];
  selectedTechnicianId?: string | number;
  isLoading?: boolean;
}

const TechnicianList: React.FC<TechnicianListProps> = memo(
  ({
    technicians,
    onTechnicianSelect,
    selectedAddress,
    selectedTechnicianId,
    isLoading = false,
  }) => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 mb-4 p-4 border rounded-lg"
              >
                <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!selectedAddress) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select an Address
            </h3>
            <p className="text-gray-600">
              Please select an address to view available technicians.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Technicians
          </h2>
          <p className="text-gray-600 mt-1">
            {technicians.length} technician{technicians.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {technicians.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No technicians found
              </h3>
              <p className="text-gray-600">
                No technicians available in your area at the moment.
              </p>
            </div>
          ) : (
            technicians.map((technician) => (
              <TechnicianCard
                key={technician._id}
                technician={technician}
                onSelect={() => onTechnicianSelect(technician)}
                isSelected={selectedTechnicianId === technician._id}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

export default TechnicianList;
