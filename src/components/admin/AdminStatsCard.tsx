import React from "react";

interface AdminStatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => {
  return (
    <div
      className={`${bgColor} p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md flex items-center`}
    >
      <div className="mr-4 bg-white/20 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-white/80">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

