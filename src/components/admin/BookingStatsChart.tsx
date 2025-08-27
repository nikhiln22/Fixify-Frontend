import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface BookingStatusData {
  status: string;
  count: number;
}

interface BookingStatusChartProps {
  data: BookingStatusData[];
  loading: boolean;
}

export const BookingStatusChart: React.FC<BookingStatusChartProps> = ({
  data,
  loading,
}) => {
  const COLORS = {
    Completed: "#10b981",
    Booked: "#3b82f6",
    Pending: "#f59e0b",
    Cancelled: "#ef4444",
  };

  const chartData = data.map((item) => ({
    ...item,
    fill: COLORS[item.status as keyof typeof COLORS] || "#6b7280",
  }));

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Booking Status Distribution
        </h3>
        <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Booking Status Distribution
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No booking data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Booking Status Distribution
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, count, percent }) =>
              `${status}: ${count} (${percent ? (percent * 100).toFixed(0) : "0"}%)`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} bookings`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
