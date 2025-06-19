import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import { WalletBalance } from "../../../components/common/WalletBalance";
import {
  addMoney,
  verifyWalletSession,
  walletBalance,
  getWalletTransactions,
} from "../../../services/user.services";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { getWalletTransactionsColumns } from "../../../constants/tablecolumns/WalletTransactionsColumn";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { showToast } from "../../../utils/toast";

export const UserWallet: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const [balance, setBalance] = useState<number>(0);

  const itemsPerPage = 6;

  const fetchWalletBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await walletBalance();
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      showToast({
        message: "Failed to fetch wallet balance",
        type: "error",
      });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchWalletTransactionsWithPagination = useCallback(
    async (page: number) => {
      return await getWalletTransactions(page);
    },
    []
  );

  const {
    data: transactions,
    setData: setTransactions,
    currentPage,
    totalPages,
    setCurrentPage,
    loading: transactionsLoading,
  } = usePaginatedList(fetchWalletTransactionsWithPagination);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      searchParams.delete("session_id");
      setSearchParams(searchParams);

      setIsVerifying(true);
      verifyWalletSession(sessionId)
        .then((res) => {
          if (res?.success) {
            showToast({
              message: "Money added to wallet successfully",
              type: "success",
            });
            setBalance(res.data.balance);
            if (res.data.transaction) {
              setTransactions((prevTransactions) => [
                res.data.transaction,
                ...prevTransactions,
              ]);
            }
          } else {
            console.error("Verification failed:", res);
            showToast({
              message: res?.message || "Failed to verify the payment session",
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.error("Error verifying payment session:", error);
          showToast({
            message: "Error verifying payment session",
            type: "error",
          });
        })
        .finally(() => {
          searchParams.delete("session_id");
          setSearchParams(searchParams);
          setIsVerifying(false);
        });
    }
  }, [searchParams, setSearchParams]);

  const handleAddMoney = async (amount: number) => {
    try {
      const response = await addMoney(amount);
      console.log("response after adding the money to the wallet:", response);
      if (
        response.success &&
        response.data?.requiresPayment &&
        response.data.checkoutUrl
      ) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error("Error adding money:", error);
      showToast({
        message: "Failed to initiate payment",
        type: "error",
      });
    }
  };

  const columns = getWalletTransactionsColumns();

  return (
    <UserLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-12 pl-42">
          <UserProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            </div>

            <WalletBalance
              balance={balance}
              loading={isVerifying || isLoadingBalance}
              onAddMoney={handleAddMoney}
            />

            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Wallet Transactions
              </h3>

              <div className="overflow-hidden">
                <div className="w-full" style={{ overflowX: "hidden" }}>
                  <Table
                    data={transactions || []}
                    columns={columns}
                    currentPage={currentPage}
                    loading={transactionsLoading}
                    pageSize={itemsPerPage}
                  />
                </div>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
