import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { VerificationBanner } from "../../../components/technician/VerificationBanner";
import { QualificationForm } from "../../../components/technician/QualificationForm";
import { TechnicianDashboardStats } from "../../../components/technician/TechnicianDashBoardStats";
import { TechnicianEarningsChart } from "../../../components/technician/TechniciansEarningsChart";
import { ServiceRevenueChart } from "../../../components/technician/ServiceRevenue";
import { BookingStatusChart } from "../../../components/technician/BookingStatusChart";
import {
  submitTechnicianQualification,
  getTechnicianDashBoardStats,
  getTechnicianEarnings,
  getTechnicianServiceCategories,
  getTechnicianBookingStatus,
} from "../../../services/technicianServices";
import { getTechnicianProfile } from "../../../services/technicianServices";
import { getAllDesignations } from "../../../services/designationService";
import { useDispatch } from "react-redux";
import { updateTechnicianData } from "../../../redux/slices/technicianslice";

interface TechnicianDashboardStatsData {
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  pendingJobs: number;
}

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

interface ServiceRevenueData {
  serviceId: string;
  serviceName: string;
  revenue: number;
  jobsCount: number;
  percentage: number;
}

interface BookingStatusData {
  status: string;
  count: number;
  percentage: number;
}

type Period = "daily" | "weekly" | "monthly" | "yearly";

export const TechnicianPortal: React.FC = () => {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [designations, setDesignations] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);

  const [statsData, setStatsData] = useState<TechnicianDashboardStatsData>({
    totalEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    pendingJobs: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [earningsSummary, setEarningsSummary] =
    useState<EarningsSummary | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [earningsError, setEarningsError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("daily");

  const [serviceRevenueData, setServiceRevenueData] = useState<
    ServiceRevenueData[]
  >([]);
  const [serviceRevenueLoading, setServiceRevenueLoading] = useState(false);
  const [serviceRevenueError, setServiceRevenueError] = useState<string | null>(
    null
  );
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [bookingStatusData, setBookingStatusData] = useState<
    BookingStatusData[]
  >([]);
  const [bookingStatusLoading, setBookingStatusLoading] = useState(false);
  const [bookingStatusError, setBookingStatusError] = useState<string | null>(
    null
  );
  const [totalBookings, setTotalBookings] = useState(0);

  const fetchDesignations = async () => {
    try {
      setDesignationsLoading(true);
      const response = await getAllDesignations(null, "technician", "", "");
      console.log("Designations response in portal:", response);

      const designationsData = Array.isArray(response)
        ? response
        : response.data || [];

      const designationOptions = designationsData.map(
        (designation: { _id: string; designation: string }) => ({
          value: designation._id,
          label: designation.designation,
        })
      );

      setDesignations(designationOptions);
    } catch (error) {
      console.error("Error occurred while fetching designations:", error);
      setDesignations([]);
    } finally {
      setDesignationsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getTechnicianDashBoardStats();
      console.log("Dashboard stats response:", response);

      if (response.success && response.data) {
        setStatsData({
          totalEarnings: response.data.totalEarnings || 0,
          completedJobs: response.data.completedJobs || 0,
          averageRating: response.data.averageRating || 0,
          pendingJobs: response.data.pendingJobs || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchEarningsData = async (period: Period) => {
    try {
      setEarningsLoading(true);
      setEarningsError(null);

      console.log(`Fetching ${period} earnings data...`);

      const response = await getTechnicianEarnings();
      console.log("Earnings data response:", response);

      if (response.success) {
        setEarningsData(response.data || []);
        setEarningsSummary(response.summary || null);
      } else {
        setEarningsError(response.message || "Failed to fetch earnings data");
        setEarningsData([]);
        setEarningsSummary(null);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      setEarningsError("Network error. Please try again.");
      setEarningsData([]);
      setEarningsSummary(null);
    } finally {
      setEarningsLoading(false);
    }
  };

  const fetchServiceRevenue = async () => {
    try {
      setServiceRevenueLoading(true);
      setServiceRevenueError(null);

      console.log("Fetching service revenue data...");
      const response = await getTechnicianServiceCategories("technician");
      console.log("Service revenue response:", response);

      if (response.success) {
        setServiceRevenueData(response.data || []);
        setTotalRevenue(response.totalRevenue || 0);
      } else {
        setServiceRevenueError(
          response.message || "Failed to fetch service revenue"
        );
        setServiceRevenueData([]);
        setTotalRevenue(0);
      }
    } catch (error) {
      console.error("Error fetching service revenue:", error);
      setServiceRevenueError("Network error. Please try again.");
      setServiceRevenueData([]);
      setTotalRevenue(0);
    } finally {
      setServiceRevenueLoading(false);
    }
  };

  const fetchBookingStatus = async () => {
    try {
      setBookingStatusLoading(true);
      setBookingStatusError(null);

      console.log("Fetching booking status data...");
      const response = await getTechnicianBookingStatus("technician");
      console.log("Booking status response:", response);

      if (response.success) {
        setBookingStatusData(response.data || []);
        setTotalBookings(response.totalBookings || 0);
      } else {
        setBookingStatusError(
          response.message || "Failed to fetch booking status"
        );
        setBookingStatusData([]);
        setTotalBookings(0);
      }
    } catch (error) {
      console.error("Error fetching booking status:", error);
      setBookingStatusError("Network error. Please try again.");
      setBookingStatusData([]);
      setTotalBookings(0);
    } finally {
      setBookingStatusLoading(false);
    }
  };

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    fetchEarningsData(period);
  };

  useEffect(() => {
    const fetchTechnicianProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getTechnicianProfile("technician");
        console.log(
          "technician profile in the technician portal page:",
          response
        );

        if (response) {
          const isVerifiedFromDB = response.is_verified || false;
          const isEmailVerifiedFromDB = response.email_verified || false;
          setIsVerified(isVerifiedFromDB);
          setIsEmailVerified(isEmailVerifiedFromDB);

          const hasQualifications = !!(
            response.yearsOfExperience ||
            response.Designation ||
            response.About ||
            response.image ||
            response.address ||
            (response.certificates && response.certificates.length > 0)
          );

          if (isVerifiedFromDB) {
            setIsSubmitted(false);
            fetchDashboardStats();
            fetchEarningsData(selectedPeriod);
            fetchServiceRevenue();
            fetchBookingStatus();
          } else if (hasQualifications) {
            setIsSubmitted(true);
          } else {
            setIsSubmitted(false);
          }
        }

        fetchDesignations();
      } catch (error) {
        console.error("Error fetching technician profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnicianProfile();
  }, []);

  const handleStartVerification = () => {
    setShowQualificationForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    console.log("Form submitted with data:", formData);
    try {
      const data = new FormData();
      data.append("experience", formData.experience);
      data.append("designation", formData.designation);
      data.append("about", formData.about);
      if (formData.currentLocation) {
        data.append("address", formData.currentLocation.address || "");
        data.append(
          "latitude",
          formData.currentLocation.latitude?.toString() || ""
        );
        data.append(
          "longitude",
          formData.currentLocation.longitude?.toString() || ""
        );
      }
      if (formData.profilePhoto) {
        data.append("profilePhoto", formData.profilePhoto);
      }
      if (formData.certificates && formData.certificates.length > 0) {
        formData.certificates.forEach((certificate: File) => {
          data.append("certificates", certificate);
        });
      }

      const response = await submitTechnicianQualification(data);
      console.log("response from the technician portal:", response);

      if (response.success && response.technician) {
        const technicianData = {
          yearsOfExperience: response.technician.yearsOfExperience,
          Designation: response.technician.Designation,
          address: response.technician.address,
          About: response.technician.About,
          image: response.technician.image,
          certificates: response.technician.certificates,
          emailemail_verified: response.technician.email_verified,
        };
        console.log("Dispatching updateTechnicianData with:", technicianData);
        dispatch(updateTechnicianData(technicianData));
        console.log("Dispatched updateTechnicianData");

        setIsSubmitted(true);
        setIsVerified(false);
      } else {
        console.log("No technician data in response or success is false");
      }

      setShowQualificationForm(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting qualification:", error);
      return Promise.reject(error);
    }
  };

  const handleFormCancel = () => {
    setShowQualificationForm(false);
  };

  return (
    <TechnicianLayout>
      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="my-4 text-center">
            <p>Loading your profile information...</p>
          </div>
        </div>
      )}

      {!isLoading && isVerified && (
        <div className="px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your performance and earnings</p>
          </div>

          <TechnicianDashboardStats stats={statsData} loading={statsLoading} />

          <div className="w-full max-w-6xl mx-auto space-y-8">
            <TechnicianEarningsChart
              earningsData={earningsData}
              summary={earningsSummary}
              loading={earningsLoading}
              error={earningsError}
              onPeriodChange={handlePeriodChange}
              selectedPeriod={selectedPeriod}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ServiceRevenueChart
                data={serviceRevenueData}
                loading={serviceRevenueLoading}
                error={serviceRevenueError}
                totalRevenue={totalRevenue}
              />

              <BookingStatusChart
                data={bookingStatusData}
                loading={bookingStatusLoading}
                error={bookingStatusError}
                totalBookings={totalBookings}
              />
            </div>
          </div>
        </div>
      )}

      {!isLoading && showQualificationForm && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-full">
            <QualificationForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              designationOptions={designations}
              designationsLoading={designationsLoading}
            />
          </div>
        </div>
      )}

      {!isLoading &&
        isEmailVerified &&
        !isVerified &&
        !showQualificationForm && (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-12">
              Welcome to Technician Portal
            </h1>

            <VerificationBanner
              isVerified={isVerified}
              isSubmitted={isSubmitted}
              onStartVerification={handleStartVerification}
            />

            {!isSubmitted && (
              <div className="mt-8 text-center max-w-2xl">
                <p className="text-gray-700">
                  Complete your verification to access all features of the
                  technician portal.
                </p>
              </div>
            )}
          </div>
        )}
    </TechnicianLayout>
  );
};
