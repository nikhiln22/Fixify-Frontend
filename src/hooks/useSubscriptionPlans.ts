import { useState } from "react";
import {
  toggleSubscriptionPlanStatus,
  getAllSubscriptionPlans,
} from "../services/adminServices";
import { usePaginatedList } from "./usePaginatedList";
import { ISubscriptionPlan } from "../models/subscriptionPlan";

const useSubscriptionPlans = () => {
  const {
    data: subscriptionplans,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<ISubscriptionPlan>(getAllSubscriptionPlans);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const handleStatusToggle = async (subscriptionPlanId: string) => {
    setStatusUpdateLoading(subscriptionPlanId);
    try {
      console.log("toggling the subscription plan status");
      const result = await toggleSubscriptionPlanStatus(subscriptionPlanId);
      console.log("result from the useSubscriptionPlans hook");
      if (result) {
        setData((prevServices) =>
          prevServices.map((subscriptionplan) =>
            subscriptionplan._id === subscriptionPlanId
              ? result.data || {
                  ...subscriptionplan,
                  status: subscriptionplan.status,
                }
              : subscriptionplan
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle subscription plan status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    subscriptionplans,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading,
  };
};

export default useSubscriptionPlans;
