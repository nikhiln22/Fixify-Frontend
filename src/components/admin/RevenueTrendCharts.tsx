import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SelectField from "../common/SelectField";

interface RevenueTrendsData {
  date: string;
  revenue: number;
}

interface RevenueTrendsChartProps {
  data: RevenueTrendsData[];
  loading: boolean;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
}

const RevenueTrendsChart: React.FC<RevenueTrendsChartProps> = ({
  data,
  loading,
  timePeriod,
  onTimePeriodChange,
}) => {
  const timePeriodOptions = [
    { value: "daily", label: "Daily (Last 7 days)" },
    { value: "weekly", label: "Weekly (Last 8 weeks)" },
    { value: "monthly", label: "Monthly (Last 12 months)" },
  ];

  // Format date for display based on period
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (timePeriod === "daily") {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    } else if (timePeriod === "weekly") {
      return `Week ${date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}`;
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    }
  };

  // Format currency for tooltip
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  // Get chart title based on period
  const getChartTitle = () => {
    switch (timePeriod) {
      case "daily":
        return "Revenue Trends (Last 7 Days)";
      case "weekly":
        return "Revenue Trends (Last 8 Weeks)";
      case "monthly":
        return "Revenue Trends (Last 12 Months)";
      default:
        return "Revenue Trends";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Revenue Trends
          </h3>
          <div className="w-48">
            <SelectField
              name="timePeriod"
              value={timePeriod}
              onChange={(e) => onTimePeriodChange(e.target.value)}
              options={timePeriodOptions}
              placeholder="Select time period"
              className="text-sm"
            />
          </div>
        </div>
        <div className="h-80 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Revenue Trends
          </h3>
          <div className="w-48">
            <SelectField
              name="timePeriod"
              value={timePeriod}
              onChange={(e) => onTimePeriodChange(e.target.value)}
              options={timePeriodOptions}
              placeholder="Select time period"
              className="text-sm"
            />
          </div>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No revenue data available for selected period
        </div>
      </div>
    );
  }

  // Transform data for better display
  const chartData = data.map((item) => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {getChartTitle()}
        </h3>
        <div className="w-48">
          <SelectField
            name="timePeriod"
            value={timePeriod}
            onChange={(e) => onTimePeriodChange(e.target.value)}
            options={timePeriodOptions}
            placeholder="Select time period"
            className="text-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total:{" "}
          {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="displayDate"
            stroke="#666"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendsChart;
