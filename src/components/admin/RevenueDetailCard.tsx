import React from "react";
import { DollarSign, TrendingUp, User, Wrench, Building } from "lucide-react";

interface RevenueDetailCardProps {
  totalAmount: number;
  fixifyShare: number;
  technicianShare: number;
  paymentMethod: string;
  paymentStatus: string;
  technicianPaid: boolean;
  technicianPaidAt?: Date;
  bookingStatus: string;
}

export const RevenueDetailCard: React.FC<RevenueDetailCardProps> = ({
  totalAmount,
  fixifyShare,
  technicianShare,
  paymentMethod,
  paymentStatus,
  technicianPaid,
  technicianPaidAt,
  bookingStatus,
}) => {
  const revenuePercentage = Math.round((fixifyShare / totalAmount) * 100);
  const technicianPercentage = Math.round(
    (technicianShare / totalAmount) * 100
  );
  const isCompleted = bookingStatus === "Completed";

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 bg-green-100 rounded-full">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue Details
            </h2>
            <p className="text-sm text-gray-500">
              Payment breakdown and revenue share
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Payment Summary
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                paymentStatus === "Paid"
                  ? "bg-green-100 text-green-800"
                  : paymentStatus === "Refunded"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {paymentStatus}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Revenue Breakdown
          </h3>

          <div className="space-y-4">
            {/* Fixify Share */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Fixify Share
                  </p>
                  <p className="text-xs text-gray-500">
                    {revenuePercentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  ₹{fixifyShare}
                </p>
              </div>
            </div>

            {/* Technician Share */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 bg-purple-100 rounded-full">
                  <Wrench className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Technician Share
                  </p>
                  <p className="text-xs text-gray-500">
                    {technicianPercentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-purple-600">
                  ₹{technicianShare}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technician Payment Status */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Technician Payment
          </h3>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-8 w-8 bg-gray-100 rounded-full">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Payment Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    technicianPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {technicianPaid ? "Paid" : "Pending"}
                </span>
              </div>

              {technicianPaidAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Paid on:{" "}
                  {new Date(technicianPaidAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {!technicianPaid && isCompleted && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Payment pending for completed job
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center h-8 w-8 bg-green-100 rounded-full mx-auto mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Platform Revenue</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{fixifyShare}
              </p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full mx-auto mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Revenue Share</p>
              <p className="text-lg font-semibold text-blue-600">
                {revenuePercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
