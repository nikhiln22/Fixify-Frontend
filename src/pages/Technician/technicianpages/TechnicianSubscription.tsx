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
} from "../../../services/technicianServices";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { getSubscriptionPlanHistoryColumns } from "../../../constants/tablecolumns/SubscriptionPlanHistoryColumn";
import { ISubscriptionPlanHistory } from "../../../models/subscriptionPlanHistory";
import { ISubscriptionPlan } from "../../../models/subscriptionPlan";
import { showToast } from "../../../utils/toast";

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

interface UpcomingSubscriptionData {
  planName: string;
  commissionRate: number;
  walletCreditDelay: number;
  profileBoost: boolean;
  durationInMonths: number;
  amount: number;
  activatesOn?: string;
}

export const TechnicianSubscription: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscriptionData, setSubscriptionData] =
    useState<TechnicianSubscriptionData | null>(null);
  const [upcomingSubscription, setUpcomingSubscription] =
    useState<UpcomingSubscriptionData | null>(null);
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

  const columns = getSubscriptionPlanHistoryColumns({
    showTechnicianName: false,
  });

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      const handleStripeSuccess = async () => {
        try {
          const verifyResponse = await verifyPurchase(sessionId);

          if (verifyResponse.success) {
            showToast({
              message:
                verifyResponse.message ||
                "Subscription plan activated successfully!",
              type: "success",
            });

            if (verifyResponse.data?.currentSubscription) {
              setSubscriptionData(verifyResponse.data.currentSubscription);
            }

            if (verifyResponse.data?.upcomingSubscription) {
              setUpcomingSubscription(verifyResponse.data.upcomingSubscription);
            } else {
              setUpcomingSubscription(null);
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
            showToast({
              message: verifyResponse.message || "Failed to verify purchase",
              type: "error",
            });
          }
        } catch (error: any) {
          console.error("Error verifying purchase:", error);
          showToast({
            message: "Failed to verify purchase",
            type: "error",
          });
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
          const response = await getActiveSubscriptionPlan();
          console.log(
            "response in the technician subscription plan page:",
            response
          );
          if (response.success && response.data) {
            setSubscriptionData(response.data.currentSubscription);
            setUpcomingSubscription(response.data.upcomingSubscription || null);
          }
        } catch (error: any) {
          console.error("Error fetching subscription data:", error);
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

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Subscriptions
            </h1>

            {subscriptionData && (
              <CurrentSubscriptionPlan
                subscription={subscriptionData}
                onUpgrade={handleUpgrade}
                title="Current Subscription"
                isUpcoming={false}
              />
            )}

            {upcomingSubscription && (
              <CurrentSubscriptionPlan
                subscription={{
                  ...upcomingSubscription,
                  status: "Active" as const,
                  expiresAt: upcomingSubscription.activatesOn,
                }}
                showUpgradeButton={false}
                title="Upcoming Subscription"
                isUpcoming={true}
              />
            )}

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
        upcomingPlan={upcomingSubscription?.planName}
        title="Upgrade Your Plan"
      />
    </TechnicianLayout>
  );
};
