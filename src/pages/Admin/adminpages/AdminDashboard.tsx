import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { Users, Wrench, Clock } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
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

export const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value="123"
          icon={<Users size={24} className="text-white" />}
          bgColor="bg-gray-800"
        />
        <StatsCard
          title="Total Workers"
          value="45"
          icon={<Wrench size={24} className="text-white" />}
          bgColor="bg-gray-700"
        />
        <StatsCard
          title="Pending Approvals"
          value="5"
          icon={<Clock size={24} className="text-white" />}
          bgColor="bg-gray-600"
        />
      </div>
    </AdminLayout>
  );
};