import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { CurrentSubscriptionPlan } from "../../../components/technician/CurrentSubscriptionPlan";
import SubscriptionPlansModal from "../../../components/technician/SubscriptionPlansModal";
import {
  getActiveSubscriptionPlan,
  getSubscriptionHistory,
  getAllSubscriptionPlans,
  purchaseSubscription,
  verifyPurchase,
} from "../../../services/technician.services";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { getSubscriptionPlanHistoryColumns } from "../../../constants/tablecolumns/SubscriptionPlanHistoryColumn";
import { ISubscriptionPlanHistory } from "../../../models/subscriptionPlanHistory";
import { ISubscriptionPlan } from "../../../models/subscriptionPlan";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [subscriptionData, setSubscriptionData] =
    useState<TechnicianSubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [historyData, setHistoryData] = useState<ISubscriptionPlanHistory[]>(
    []
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [availablePlans, setAvailablePlans] = useState<ISubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const columns = getSubscriptionPlanHistoryColumns({
    showTechnicianName: false,
  });

  // ✅ Helper function to calculate expiry date
  const calculateExpiryDate = (
    startDate: Date,
    durationInMonths: number
  ): Date | null => {
    // If it's BASIC plan (usually lifetime), return null
    if (durationInMonths === 0) {
      return null;
    }

    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);
    return expiryDate;
  };

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      const handleStripeSuccess = async () => {
        try {
          setLoading(true);

          const verifyResponse = await verifyPurchase(sessionId);

          if (verifyResponse.success) {
            setSuccessMessage("Subscription plan activated successfully!");

            // ✅ Updated: Properly format the subscription data
            if (
              verifyResponse.data?.currentSubscription &&
              verifyResponse.data?.newHistoryEntry
            ) {
              const startDate = new Date();
              const expiryDate = calculateExpiryDate(
                startDate,
                verifyResponse.data.currentSubscription.durationInMonths
              );

              const newSubscriptionData: TechnicianSubscriptionData = {
                planName: verifyResponse.data.currentSubscription.planName,
                status: "Active",
                commissionRate:
                  verifyResponse.data.currentSubscription.commissionRate,
                walletCreditDelay:
                  verifyResponse.data.currentSubscription.WalletCreditDelay,
                profileBoost:
                  verifyResponse.data.currentSubscription.profileBoost,
                durationInMonths:
                  verifyResponse.data.currentSubscription.durationInMonths,
                startDate: startDate.toISOString(),
                expiresAt: expiryDate ? expiryDate.toISOString() : undefined,
                amount: verifyResponse.data.newHistoryEntry.amount,
              };

              setSubscriptionData(newSubscriptionData);
            }

            if (verifyResponse.data?.newHistoryEntry) {
              setHistoryData((prevHistory) => [
                verifyResponse.data.newHistoryEntry,
                ...prevHistory.map((item) =>
                  item.status === "Active"
                    ? { ...item, status: "Expired" as const }
                    : item
                ),
              ]);
            }

            setSearchParams({});
          } else {
            setError(verifyResponse.message || "Failed to verify purchase");
          }
        } catch (error: any) {
          console.error("Error verifying purchase:", error);
          setError("Failed to verify purchase");
        } finally {
          setLoading(false);
        }
      };

      handleStripeSuccess();
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success !== "true") {
      const fetchSubscriptionData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await getActiveSubscriptionPlan();

          if (response.success && response.data) {
            setSubscriptionData(response.data);
          } else {
            setError(response.message || "Failed to fetch subscription data");
          }
        } catch (error: any) {
          setError(
            error.response?.data?.message ||
              "An error occurred while fetching subscription data"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchSubscriptionData();
    }
  }, [searchParams]);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success !== "true") {
      fetchSubscriptionHistory(currentPage);
    }
  }, [currentPage, searchParams]);

  const fetchSubscriptionHistory = async (page: number = 1) => {
    try {
      setHistoryLoading(true);
      const response = await getSubscriptionHistory(page);
      setHistoryData(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error: any) {
      console.error("Error fetching subscription history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      setPlansLoading(true);
      setPlansError(null);
      const response = await getAllSubscriptionPlans();

      if (response.success && response.data) {
        setAvailablePlans(response.data);
      } else {
        setPlansError("Failed to fetch plans");
      }
    } catch (error: any) {
      setPlansError("Failed to fetch plans");
    } finally {
      setPlansLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setShowModal(true);
    if (availablePlans.length === 0) {
      await fetchAvailablePlans();
    }
  };

  const handlePlanSelect = async (plan: ISubscriptionPlan) => {
    try {
      setPlansLoading(true);
      const response = await purchaseSubscription(plan._id);

      if (response.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        setPlansError("Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setPlansError(
        error.response?.data?.message || "Payment initialization failed"
      );
    } finally {
      setPlansLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const dismissSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const LoadingState = () => (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Subscriptions
            </h1>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading subscription details...
              </span>
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );

  const ErrorState = () => (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Subscriptions
            </h1>
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

  const NoSubscriptionState = () => (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Subscriptions
            </h1>
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
      <SubscriptionPlansModal
        isOpen={showModal}
        onClose={closeModal}
        onPlanSelect={handlePlanSelect}
        plans={availablePlans}
        loading={plansLoading}
        error={plansError}
        title="Choose Your Plan"
      />
    </TechnicianLayout>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!subscriptionData) return <NoSubscriptionState />;

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Subscriptions
            </h1>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-green-800 font-medium">
                      {successMessage}
                    </div>
                  </div>
                  <button
                    onClick={dismissSuccessMessage}
                    className="text-green-600 hover:text-green-800 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <CurrentSubscriptionPlan
              subscription={subscriptionData}
              onUpgrade={handleUpgrade}
            />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription History
              </h2>

              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading history...</span>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No subscription history found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table
                    data={historyData}
                    columns={columns}
                    currentPage={currentPage}
                    loading={historyLoading}
                    pageSize={6}
                  />
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubscriptionPlansModal
        isOpen={showModal}
        onClose={closeModal}
        onPlanSelect={handlePlanSelect}
        plans={availablePlans}
        loading={plansLoading}
        error={plansError}
        currentPlan={subscriptionData?.planName}
        title="Upgrade Your Plan"
      />
    </TechnicianLayout>
  );
};

export default TechnicianSubscription;
