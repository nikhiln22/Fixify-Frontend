import React from "react";
import { Wallet, Briefcase, Star, Clock } from "lucide-react";
import { TechnicianStatsCard } from "./TechnicianStatsCard";

interface TechnicianDashboardStatsData {
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  pendingJobs: number;
}

interface TechnicianDashboardStatsProps {
  stats: TechnicianDashboardStatsData;
  loading: boolean;
}

export const TechnicianDashboardStats: React.FC<
  TechnicianDashboardStatsProps
> = ({ stats, loading }) => {
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
      <TechnicianStatsCard
        title="Total Earnings"
        value={`₹${stats.totalEarnings.toLocaleString()}`}
        icon={<Wallet size={24} className="text-white" />}
        bgColor="bg-green-600"
      />
      <TechnicianStatsCard
        title="Completed Jobs"
        value={stats.completedJobs.toString()}
        icon={<Briefcase size={24} className="text-white" />}
        bgColor="bg-blue-600"
      />
      <TechnicianStatsCard
        title="Average Rating"
        value={`${stats.averageRating.toFixed(1)}/5`}
        icon={<Star size={24} className="text-white" />}
        bgColor="bg-yellow-600"
      />
      <TechnicianStatsCard
        title="Pending Jobs"
        value={stats.pendingJobs.toString()}
        icon={<Clock size={24} className="text-white" />}
        bgColor="bg-orange-600"
      />
    </div>
  );
};
