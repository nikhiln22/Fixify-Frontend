import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { CurrentSubscriptionPlan } from "../../../components/technician/CurrentSubscriptionPlan";
import { getActiveSubscriptionPlan } from "../../../services/technician.services";

// Define the API response type that includes the additional fields we need
interface TechnicianSubscriptionData {
  planName: string;
  status: "Active" | "Expired";
  commissionRate: number;
  walletCreditDelay: number;
  profileBoost: boolean;
  durationInMonths: number;
  startDate: string;
  expiresAt?: string;
  amount: number;
}

const TechnicianSubscription: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<TechnicianSubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching subscription data...");
        const response = await getActiveSubscriptionPlan();
        
        console.log("API Response:", response);
        
        if (response.success && response.data) {
          setSubscriptionData(response.data);
        } else {
          setError(response.message || "Failed to fetch subscription data");
        }
      } catch (error: any) {
        console.error("Error fetching subscription data:", error);
        setError(error.response?.data?.message || "An error occurred while fetching subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleUpgrade = () => {
    console.log("Opening upgrade modal...");
    // TODO: Open upgrade modal
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-6">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  My Subscriptions
                </h1>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading subscription details...</span>
              </div>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  if (error) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-6">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  My Subscriptions
                </h1>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-600 text-lg font-medium mb-2">
                    Failed to load subscription data
                  </div>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  if (!subscriptionData) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-6">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  My Subscriptions
                </h1>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-gray-600 text-lg font-medium mb-2">
                    No Subscription Found
                  </div>
                  <p className="text-gray-500 mb-4">
                    You don't have an active subscription plan yet.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Available Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                My Subscriptions
              </h1>
            </div>

            {/* Current Subscription Section */}
            <CurrentSubscriptionPlan
              subscription={subscriptionData}
              onUpgrade={handleUpgrade}
            />

            {/* Placeholder for Future Sections */}
            <div className="space-y-6">

              {/* Subscription History Section - Coming Later */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Subscription History
                </h2>
                <p className="text-gray-600">
                  Your subscription history will be displayed here...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianSubscription;