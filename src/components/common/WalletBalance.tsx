import React, { useState } from "react";
import { Wallet } from "lucide-react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { AddMoneyForm } from "../../components/user/AddMoneyForm";
import { WalletBalanceProps } from "../../types/component.types";

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  loading = false,
  onAddMoney,
  showAddMoney = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddMoneyClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddMoneySubmit = async (amount: number) => {
    setIsProcessing(true);
    try {
      if (onAddMoney) {
        await onAddMoney(amount);
      } else {
        console.log("Add money amount:", amount);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding money:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border">
              <Wallet className="w-6 h-6 text-gray-600" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {formatCurrency(balance)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">My Wallet Balance</p>
            </div>
          </div>

          {showAddMoney && (
            <Button
              onClick={handleAddMoneyClick}
              variant="primary"
              className="px-6 py-2.5 font-medium"
            >
              Add Money
            </Button>
          )}
        </div>
      </div>

      {showAddMoney && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Add Money to Wallet"
        >
          <AddMoneyForm
            onSubmit={handleAddMoneySubmit}
            onCancel={handleModalClose}
            loading={isProcessing}
          />
        </Modal>
      )}
    </>
  );
};
