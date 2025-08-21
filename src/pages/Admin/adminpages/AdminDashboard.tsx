import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { AdminDashboardStats } from "../../../components/admin/AdminDashboardStats";
import {
  getDashboardStats,
  getBookingStatusDistribution,
  getRevenueTrends,
  getServiceCategoryPerformance,
} from "../../../services/adminServices";
import { BookingStatusChart } from "../../../components/admin/BookingStatsChart";
import RevenueTrendsChart from "../../../components/admin/RevenueTrendCharts";
import { ServiceCategoryChart } from "../../../components/admin/ServiceCategoryChart";

interface AdminDashboardStatsData {
  totalRevenue: number;
  totalBookings: number;
  activeTechnicians: number;
  totalCustomers: number;
}

interface BookingStatusData {
  status: string;
  count: number;
}

interface RevenueTrendsData {
  date: string;
  revenue: number;
}

interface ServiceCategoryData {
  categoryName: string;
  bookingCount: number;
  categoryId: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStatsData>({
    totalRevenue: 0,
    totalBookings: 0,
    activeTechnicians: 0,
    totalCustomers: 0,
  });

  const [bookingStatusData, setBookingStatusData] = useState<
    BookingStatusData[]
  >([]);
  const [revenueTrendsData, setRevenueTrendsData] = useState<
    RevenueTrendsData[]
  >([]);
  const [serviceCategoryData, setServiceCategoryData] = useState<
    ServiceCategoryData[]
  >([]);
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const getDaysForPeriod = (period: string) => {
    switch (period) {
      case "daily":
        return 7;
      case "weekly":
        return 56; // 8 weeks = 56 days
      case "monthly":
        return 365; // 12 months = 365 days
      default:
        return 30;
    }
  };

  const fetchRevenueTrends = async (period: string) => {
    try {
      setRevenueLoading(true);
      const days = getDaysForPeriod(period);
      const response = await getRevenueTrends(days);
      console.log(`Revenue trends for ${period}:`, response);
      setRevenueTrendsData(response.data);
    } catch (error) {
      console.error("Error fetching revenue trends:", error);
    } finally {
      setRevenueLoading(false);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    fetchRevenueTrends(period);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setChartLoading(true);

        const [
          statsResponse,
          chartResponse,
          revenueResponse,
          categoryResponse,
        ] = await Promise.all([
          getDashboardStats(),
          getBookingStatusDistribution(),
          getRevenueTrends(getDaysForPeriod(timePeriod)),
          getServiceCategoryPerformance(10, 30),
        ]);

        setStats(statsResponse.data);
        setBookingStatusData(chartResponse.data);
        setRevenueTrendsData(revenueResponse.data);
        setServiceCategoryData(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <AdminDashboardStats stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BookingStatusChart data={bookingStatusData} loading={chartLoading} />
        <RevenueTrendsChart
          data={revenueTrendsData}
          loading={revenueLoading}
          timePeriod={timePeriod}
          onTimePeriodChange={handleTimePeriodChange}
        />
      </div>

      <div className="mb-8">
        <ServiceCategoryChart
          data={serviceCategoryData}
          loading={chartLoading}
        />
      </div>

      {/* Future sections */}
      <div className="space-y-6">
        {/* Recent activity section can be added here */}
        {/* Management sections can be added here */}
      </div>
    </AdminLayout>
  );
};
