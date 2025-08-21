import React, { useState, useEffect, useCallback } from "react";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { WalletBalance } from "../../../components/common/WalletBalance";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { getWalletTransactionsColumns } from "../../../constants/tablecolumns/WalletTransactionsColumn";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import {
  walletBalance,
  getWalletTransactions,
} from "../../../services/technicianServices";

export const TechnicianEarnings: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const itemsPerPage = 6;

  const fetchWalletBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await walletBalance();
      console.log("response:", response);
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
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
    currentPage,
    totalPages,
    setCurrentPage,
    loading: transactionsLoading,
  } = usePaginatedList(fetchWalletTransactionsWithPagination);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const columns = getWalletTransactionsColumns();

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-gray-600">
              Manage your wallet balance and view transaction history
            </p>
          </div>

          <div className="space-y-8">
            <WalletBalance
              balance={balance}
              loading={isLoadingBalance}
              showAddMoney={false}
            />

            <div className="w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Wallet Transactions
              </h3>

              {transactionsLoading ? (
                <div className="bg-white rounded-lg shadow">
                  <Table
                    data={[]}
                    columns={columns}
                    currentPage={currentPage}
                    loading={transactionsLoading}
                    pageSize={itemsPerPage}
                  />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <>
                  <div className="bg-white rounded-lg shadow">
                    <Table
                      data={transactions}
                      columns={columns}
                      currentPage={currentPage}
                      loading={transactionsLoading}
                      pageSize={itemsPerPage}
                    />
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">₹</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-gray-500">
                      Your earnings and payment history will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};
