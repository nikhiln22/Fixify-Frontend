import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ServiceCategoryData {
  categoryName: string;
  bookingCount: number;
  categoryId: string;
}

interface ServiceCategoryChartProps {
  data: ServiceCategoryData[];
  loading: boolean;
}

export const ServiceCategoryChart: React.FC<ServiceCategoryChartProps> = ({
  data,
  loading,
}) => {
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
    "#ec4899", // pink
    "#6b7280", // gray
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Category Performance
        </h3>
        <div className="h-80 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Category Performance
        </h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No service category data available
        </div>
      </div>
    );
  }

  // Debug log
  console.log("ServiceCategoryChart data:", data);

  // Add colors to data and ensure proper structure
  const chartData = data.map((item, index) => ({
    categoryName: item.categoryName || "Unknown Category",
    bookingCount: item.bookingCount || 0,
    categoryId: item.categoryId,
    fill: COLORS[index % COLORS.length],
  }));

  console.log("Chart data processed:", chartData);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">{`Bookings: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Service Category Performance
        </h3>
        <div className="text-sm text-gray-600">
          Total Bookings:{" "}
          {data.reduce((sum, item) => sum + item.bookingCount, 0)}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="categoryName"
            stroke="#666"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis stroke="#666" fontSize={12} domain={[0, "dataMax + 1"]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="bookingCount" radius={[4, 4, 0, 0]} minPointSize={10}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Top 3 Categories Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Top Performing Categories:
        </h4>
        <div className="flex flex-wrap gap-3">
          {data.slice(0, 3).map((category, index) => (
            <div
              key={category.categoryId}
              className="flex items-center text-sm"
            >
              <div
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="text-gray-600">
                {category.categoryName}:{" "}
                <span className="font-medium">{category.bookingCount}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
