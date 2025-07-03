import React from "react";
import { XCircle, Calendar, Clock, RefreshCw, MessageSquare } from "lucide-react";

interface CancellationCardProps {
  bookingStatus: string;
  cancellationDate?: Date;
  cancellationReason?: string; // Added cancellation reason prop
  refundStatus?: string;
  refundDate?: Date;
  refundAmount?: number;
  originalAmount: number;
}

export const CancellationCard: React.FC<CancellationCardProps> = ({
  bookingStatus,
  cancellationDate,
  cancellationReason,
  refundStatus,
  refundDate,
  refundAmount,
  originalAmount,
}) => {
  const isCancelled = bookingStatus === "Cancelled";
  const isRefunded = refundStatus === "Refunded";

  if (!isCancelled) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-red-500">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-10 w-10 bg-red-100 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Cancelled
            </h2>
            <p className="text-sm text-gray-500">
              This booking has been cancelled
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cancellation Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Cancellation Details
            </h3>
            
            {cancellationDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Cancelled on:</span>
                <span className="font-medium">
                  {new Date(cancellationDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            {cancellationDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Time:</span>
                <span className="font-medium">
                  {new Date(cancellationDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            {/* Added cancellation reason display */}
            {cancellationReason && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="h-4 w-4" />
                <span>Reason:</span>
                <span className="font-medium text-gray-800">
                  {cancellationReason}
                </span>
              </div>
            )}
          </div>

          {/* Refund Information - Only show if refund data exists */}
          {(refundStatus || refundAmount !== undefined || refundDate) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Refund Information
              </h3>
              
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                <span>Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRefunded
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {refundStatus || "Pending"}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <span>Original Amount:</span>
                <span className="font-medium ml-2">₹{originalAmount}</span>
              </div>

              {refundAmount !== undefined && (
                <div className="text-sm text-gray-600">
                  <span>Refund Amount:</span>
                  <span className="font-medium ml-2 text-green-600">
                    ₹{refundAmount}
                  </span>
                </div>
              )}

              {refundDate && (
                <div className="text-sm text-gray-600">
                  <span>Refunded on:</span>
                  <span className="font-medium ml-2">
                    {new Date(refundDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Refund Summary - Only show if refund amount exists */}
        {refundAmount !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Refund Summary
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Refund Percentage: {Math.round((refundAmount / originalAmount) * 100)}%
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    ₹{refundAmount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};