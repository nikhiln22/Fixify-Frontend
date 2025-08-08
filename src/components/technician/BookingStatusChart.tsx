import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface BookingStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface BookingStatusChartProps {
  data: BookingStatusData[];
  loading: boolean;
  error: string | null;
  totalBookings?: number;
}

const STATUS_COLORS: Record<string, string> = {
  Completed: "#10B981",
  Booked: "#3B82F6",
  Pending: "#F59E0B",
  Cancelled: "#EF4444",
};

export const BookingStatusChart: React.FC<BookingStatusChartProps> = ({
  data,
  loading,
  error,
  //   totalBookings,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "booked":
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Custom tooltip for booking status
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(data.status)}
            <p className="font-semibold text-gray-900">{data.status}</p>
          </div>
          <div className="space-y-1">
            <p className="text-blue-600">
              <span className="font-medium">Jobs:</span> {data.count}
            </p>
            <p className="text-purple-600">
              <span className="font-medium">Percentage:</span> {data.percentage}
              %
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie slices
  const renderLabel = (entry: BookingStatusData) => {
    return `${entry.percentage}%`;
  };

  // Prepare data with colors
  const dataWithColors = data.map((item) => ({
    ...item,
    fill: STATUS_COLORS[item.status] || "#6B7280",
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Booking Status Distribution
        </h3>
        <p className="text-gray-600">Overview of your job completion rates</p>
        {/* {!loading && !error && (
          <p className="text-sm text-gray-500 mt-1">
            Total Bookings:{" "}
            <span className="font-semibold text-blue-600">{totalBookings}</span>
          </p>
        )} */}
      </div>

      {/* Chart Area */}
      <div className="h-80">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading booking status...</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">
                Error loading data
              </p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No booking data available
              </p>
              <p className="text-gray-400 text-sm">
                Start taking bookings to see your status breakdown
              </p>
            </div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => {
                  const data = entry.payload as BookingStatusData;
                  return (
                    <span
                      style={{ color: entry.color }}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(data.status)}
                      {value} ({data.count} jobs)
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && !error && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Completed</p>
              <p className="font-semibold text-green-600">
                {data.find((item) => item.status === "Completed")?.count || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Pending</p>
              <p className="font-semibold text-blue-600">
                {(data.find((item) => item.status === "Booked")?.count || 0) +
                  (data.find((item) => item.status === "Pending")?.count || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Cancelled</p>
              <p className="font-semibold text-red-600">
                {data.find((item) => item.status === "Cancelled")?.count || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
