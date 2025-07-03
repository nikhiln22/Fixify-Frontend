import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface CancellationPolicyProps {
  booking: {
    refundAmount?: number;
    refundPercentage?: number;
  };
  reason: string;
  onReasonChange: (reason: string) => void;
}

export const UserCancellationPolicy: React.FC<CancellationPolicyProps> = ({
  booking,
  reason,
  onReasonChange,
}) => {
  const { refundAmount = 0, refundPercentage = 0 } = booking;

  return (
    <div className="w-full space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {refundPercentage === 0
              ? "No Refund Available"
              : `₹${refundAmount} Refund`}
          </h3>
          <p className="text-base text-gray-600">
            {refundPercentage === 0
              ? "Cancelling less than 2 hours before service means no refund is possible."
              : refundPercentage === 100
                ? "You're cancelling well in advance, so you'll receive a full refund."
                : `You're cancelling within 6 hours of service, so you'll receive a ${refundPercentage}% partial refund.`}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <Info className="w-4 h-4 text-gray-600" />
          </div>
          <h4 className="font-semibold text-gray-900 text-xl">
            Cancellation Policy
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h5 className="font-bold text-gray-900 text-xl mb-2">
              100% Full Refund
            </h5>
            <p className="text-base text-gray-600">
              Cancel <span className="font-semibold text-black">6+ hours</span>{" "}
              before your scheduled service
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h5 className="font-bold text-gray-900 text-xl mb-2">
              50% Partial Refund
            </h5>
            <p className="text-base text-gray-600">
              Cancel <span className="font-semibold text-black">2-6 hours</span>{" "}
              before your scheduled service
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h5 className="font-bold text-gray-900 text-xl mb-2">No Refund</h5>
            <p className="text-base text-gray-600">
              Cancel{" "}
              <span className="font-semibold text-black">
                less than 2 hours
              </span>{" "}
              before your scheduled service
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">
          Why are you cancelling?
        </label>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Help us improve by sharing your reason for cancellation..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-colors text-base bg-white"
          rows={3}
        />
      </div>
    </div>
  );
};
