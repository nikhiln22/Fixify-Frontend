import React from "react";
import { Calendar, Clock, CreditCard, Star, TrendingUp } from "lucide-react";
import Button from "../common/Button"; 

interface CurrentSubscriptionProps {
  subscription: {
    planName: string;
    status: "Active" | "Expired";
    commissionRate: number;
    walletCreditDelay: number;
    profileBoost: boolean;
    durationInMonths: number;
    expiresAt?: string;
    amount: number;
  };
  onUpgrade?: () => void;
}

export const CurrentSubscriptionPlan: React.FC<CurrentSubscriptionProps> = ({
  subscription,
  onUpgrade,
}) => {
  const {
    planName,
    status,
    commissionRate,
    walletCreditDelay,
    profileBoost,
    durationInMonths,
    expiresAt,
    amount,
  } = subscription;


  const getPlanColor = (plan: string) => {
    switch (plan.toUpperCase()) {
      case "BASIC":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "PRO":
        return "bg-green-50 border-green-200 text-green-800";
      case "ELITE":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            Current Subscription
          </h2>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
          <Button
            onClick={onUpgrade}
            variant="primary"
            className="px-4 py-2"
          >
            Upgrade Plan
          </Button>
      </div>

      <div className="mb-6">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold border ${getPlanColor(
            planName
          )}`}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {planName} Plan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Commission Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{commissionRate}%</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Credit Delay
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {walletCreditDelay} Days
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Profile Boost
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${
              profileBoost ? "text-green-600" : "text-red-600"
            }`}
          >
            {profileBoost ? "Yes" : "No"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Amount Paid
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">
            {durationInMonths === 0 ? "Duration:" : "Expires:"}
          </span>
          <span className="font-medium text-gray-900">
            {durationInMonths === 0
              ? "Lifetime"
              : expiresAt
                ? formatDate(expiresAt)
                : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};