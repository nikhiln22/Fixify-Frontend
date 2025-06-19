import React, { useState, useEffect } from "react";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { WalletBalance } from "../../../components/common/WalletBalance";

export const TechnicianEarnings: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setIsLoadingBalance(true);

        setTimeout(() => {
          setBalance(15750);
          setTransactions([]); 
          setIsLoadingBalance(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
        setIsLoadingBalance(false);
      }
    };

    fetchEarningsData();
  }, []);

  return (
    <TechnicianLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-6">
          <TechnicianProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Earnings & Payments
              </h1>
            </div>

            <WalletBalance
              balance={balance}
              loading={isVerifying || isLoadingBalance}
              showAddMoney={false} 
            />
{/* 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  This Month
                </h3>
                <p className="text-2xl font-bold text-gray-900">₹8,450</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Last Month
                </h3>
                <p className="text-2xl font-bold text-gray-900">₹7,550</p>
                <p className="text-sm text-gray-600 mt-1">Previous month earnings</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total Earnings
                </h3>
                <p className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">All time earnings</p>
              </div>
            </div> */}

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Recent Wallet Transactions
                </h3>
              </div>
              
              <div className="p-6">
                {isLoadingBalance ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div>
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold">₹</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Service Payment</p>
                            <p className="text-sm text-gray-500">Jan 15, 2025</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">+₹850</span>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};