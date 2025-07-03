import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface TechnicianCancellationPolicyProps {
  booking: {
    hoursUntilService?: number;
    isToday?: boolean;
  };
  reason: string;
  onReasonChange: (reason: string) => void;
}

export const TechnicianCancellationPolicy: React.FC<
  TechnicianCancellationPolicyProps
> = ({ booking, reason, onReasonChange }) => {
  const { hoursUntilService = 0, isToday = false } = booking;

  const canCancel = () => {
    if (isToday) return false;

    if (hoursUntilService < 2) return false;

    return true;
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <Info className="w-4 h-4 text-gray-600" />
          </div>
          <h4 className="font-semibold text-gray-900 text-xl">
            Technician Cancellation Policy
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h5 className="font-bold text-gray-900 text-lg mb-3 text-center">
              ✅ Can Cancel When
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Booking is on another day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  More than <strong>2 hours</strong> remain before the job
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Reason is provided</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h5 className="font-bold text-gray-900 text-lg mb-3 text-center">
              ❌ Cannot Cancel When
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Booking is scheduled <strong>for today</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Less than <strong>2 hours</strong> remain before the job
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Reason is missing</span>
              </li>
            </ul>
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
          disabled={!canCancel()}
        />
      </div>
    </div>
  );
};
