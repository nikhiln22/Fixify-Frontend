import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Briefcase, Loader2 } from "lucide-react";


interface ServiceRevenueData {
  serviceId: string;
  serviceName: string;
  revenue: number;
  jobsCount: number;
  percentage: number;
}


interface ServiceRevenueChartProps {
  data: ServiceRevenueData[];
  loading: boolean;
  error: string | null;
  totalRevenue: number;
}

const SERVICE_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#84CC16",
];


export const ServiceRevenueChart: React.FC<ServiceRevenueChartProps> = ({
  data,
  loading,
  error,
  totalRevenue,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.serviceName}</p>
          <div className="space-y-1">
            <p className="text-green-600">
              <span className="font-medium">Revenue:</span>{" "}
              {formatCurrency(data.revenue)}
            </p>
            <p className="text-blue-600">
              <span className="font-medium">Jobs:</span> {data.jobsCount}
            </p>
            <p className="text-purple-600">
              <span className="font-medium">Share:</span> {data.percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };


  const renderLabel = (entry: ServiceRevenueData) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Revenue by Services Performed
        </h3>
        <p className="text-gray-600">
          Breakdown of earnings from individual services
        </p>
        {!loading && !error && (
          <p className="text-sm text-gray-500 mt-1">
            Total Revenue:{" "}
            <span className="font-semibold text-green-600">
              {formatCurrency(totalRevenue)}
            </span>
          </p>
        )}
      </div>

      
      <div className="h-80">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading service breakdown...</span>
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
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No service data available
              </p>
              <p className="text-gray-400 text-sm">
                Complete some jobs to see your service breakdown
              </p>
            </div>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SERVICE_COLORS[index % SERVICE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => {
                  const serviceData = entry.payload as ServiceRevenueData;
                  return (
                    <span style={{ color: entry.color }}>
                      {serviceData.serviceName} (
                      {formatCurrency(serviceData.revenue)})
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      
      {!loading && !error && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Top Service</p>
              <p className="font-semibold text-gray-900">
                {data[0]?.serviceName}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Services</p>
              <p className="font-semibold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
