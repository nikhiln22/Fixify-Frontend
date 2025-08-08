import React from "react";

interface TechnicianStatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

export const TechnicianStatsCard: React.FC<TechnicianStatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
      </div>
    </div>
  );
};
