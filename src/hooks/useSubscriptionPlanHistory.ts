import { getAllSubscriptionPlansHistory } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { ISubscriptionPlanHistory } from "../models/subscriptionPlanHistory";

const useSubscriptionPlansHistory = () => {
  const {
    data: subscriptionplansHistory,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<ISubscriptionPlanHistory>(
    getAllSubscriptionPlansHistory
  );

  return {
    subscriptionplansHistory,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
  };
};

export default useSubscriptionPlansHistory;
