import { getWalletTransactions } from "../services/user.services";
import { usePaginatedList } from "./usePaginatedList";
import { IWalletTransaction } from "../models/walletTransaction";

const useWalletTransactions = () => {
  const {
    data: transactions,
    currentPage,
    setCurrentPage,
    loading,
    totalPages,
    error,
  } = usePaginatedList<IWalletTransaction>(getWalletTransactions);

  return {
    transactions,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
  };
};

export default useWalletTransactions;
