import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Briefcase,
  BarChart3,
  LineChart as LineChartIcon,
  Loader2,
} from "lucide-react";

interface EarningsData {
  date: string;
  earnings: number;
  jobs: number;
  avgPerJob: number;
  period: string;
}

interface EarningsSummary {
  totalEarnings: number;
  totalJobs: number;
  avgEarningsPerPeriod: number;
  period: string;
}

type Period = "daily" | "weekly" | "monthly" | "yearly";
type ChartType = "line" | "bar";

interface TechnicianEarningsChartProps {
  earningsData: EarningsData[];
  summary: EarningsSummary | null;
  loading: boolean;
  error: string | null;
  onPeriodChange: (period: Period) => void;
  selectedPeriod: Period;
}

export const TechnicianEarningsChart: React.FC<
  TechnicianEarningsChartProps
> = ({
  earningsData,
  summary,
  loading,
  error,
  onPeriodChange,
  selectedPeriod,
}) => {
  const [chartType, setChartType] = useState<ChartType>("line");

  const periodOptions: {
    value: Period;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "daily", label: "Daily", icon: <Calendar className="w-4 h-4" /> },
    {
      value: "weekly",
      label: "Weekly",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "yearly",
      label: "Yearly",
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  // Chart type options
  const chartTypeOptions: {
    value: ChartType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "line",
      label: "Line Chart",
      icon: <LineChartIcon className="w-4 h-4" />,
    },
    {
      value: "bar",
      label: "Bar Chart",
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-green-600">
              <span className="font-medium">Earnings:</span>{" "}
              {formatCurrency(data.earnings)}
            </p>
            <p className="text-blue-600">
              <span className="font-medium">Jobs:</span> {data.jobs}
            </p>
            <p className="text-purple-600">
              <span className="font-medium">Avg per Job:</span>{" "}
              {formatCurrency(data.avgPerJob)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Earnings Trends
          </h3>
          <p className="text-gray-600">Track your earnings over time</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          {/* Period Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPeriodChange(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === option.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {chartTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setChartType(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === option.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Total Earnings
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(summary.totalEarnings)}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Total Jobs
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {summary.totalJobs}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Avg per{" "}
                {summary.period === "daily"
                  ? "Day"
                  : summary.period === "weekly"
                    ? "Week"
                    : summary.period === "monthly"
                      ? "Month"
                      : "Year"}
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {formatCurrency(summary.avgEarningsPerPeriod)}
            </p>
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className="h-80">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading earnings data...</span>
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

        {!loading && !error && earningsData.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No earnings data available
              </p>
              <p className="text-gray-400 text-sm">
                Complete some jobs to see your earnings here
              </p>
            </div>
          </div>
        )}

        {!loading && !error && earningsData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={earningsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={earningsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
