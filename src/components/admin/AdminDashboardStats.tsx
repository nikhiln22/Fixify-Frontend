import React from "react";
import { Users, Wrench, Clock, IndianRupee } from "lucide-react";
import { AdminStatsCard } from "./AdminStatsCard";

interface AdminDashboardStatsData {
  totalRevenue: number;
  totalBookings: number;
  activeTechnicians: number;
  totalCustomers: number;
}

interface AdminDashboardStatsProps {
  stats: AdminDashboardStatsData;
  loading: boolean;
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse p-6 rounded-lg h-24"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <AdminStatsCard
        title="Total Revenue"
        value={`₹${stats.totalRevenue.toLocaleString()}`}
        icon={<IndianRupee size={24} className="text-white" />}
        bgColor="bg-green-600"
      />
      <AdminStatsCard
        title="Total Bookings"
        value={stats.totalBookings.toString()}
        icon={<Clock size={24} className="text-white" />}
        bgColor="bg-blue-600"
      />
      <AdminStatsCard
        title="Active Technicians"
        value={stats.activeTechnicians.toString()}
        icon={<Wrench size={24} className="text-white" />}
        bgColor="bg-purple-600"
      />
      <AdminStatsCard
        title="Total Customers"
        value={stats.totalCustomers.toString()}
        icon={<Users size={24} className="text-white" />}
        bgColor="bg-orange-600"
      />
    </div>
  );
};
