import React, { useState } from "react";

interface ReplacementPart {
  partId: {
    _id: string;
    name: string;
    description: string;
    price: number;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}

interface PartsApprovalData {
  bookingId: string;
  replacementParts: ReplacementPart[];
  totalPartsAmount: number;
}

interface PartsApprovalProps {
  partsData: PartsApprovalData | null;
  loading: boolean;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export const PartsApproval: React.FC<PartsApprovalProps> = ({
  partsData,
  loading: actionLoading,
  onApprove,
  onReject,
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string>("");

  const handleRejectClick = () => {
    setShowRejectReason(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    onReject(rejectionReason);
  };

  const handleRejectCancel = () => {
    setShowRejectReason(false);
    setRejectionReason("");
    setError("");
  };

  if (actionLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Loading replacement parts...
        </p>
      </div>
    );
  }

  if (!partsData || !partsData.replacementParts?.length) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-lg text-gray-600 font-medium">No parts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Replacement Parts Required
            </p>
            <p className="text-sm text-blue-800">
              Your technician has identified the following parts that need to be
              replaced. Please review and approve to proceed with the service.
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3">
        {partsData.replacementParts.map((part, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {part.partId.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {part.partId.description}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Unit Price: </span>
                    <span className="font-semibold text-gray-900">
                      ₹{part.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Quantity: </span>
                    <span className="font-semibold text-gray-900">
                      {part.quantity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{part.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="mt-6 border-t pt-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Total Parts
            </span>
            <span className="text-sm text-gray-600">
              {partsData.replacementParts.length} item(s)
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{partsData.totalPartsAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Rejection Reason Section */}
      {showRejectReason && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <label
            htmlFor="rejectionReason"
            className="block text-sm font-semibold text-red-900 mb-2"
          >
            Reason for Rejection *
          </label>
          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setError("");
            }}
            rows={3}
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Please provide a reason for rejecting these parts..."
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      )}

      {/* Action Buttons */}
      {!showRejectReason ? (
        <div className="mt-6 flex gap-3">
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {actionLoading ? "Approving..." : "Approve Parts"}
          </button>
          <button
            onClick={handleRejectClick}
            disabled={actionLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Reject Parts
          </button>
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleRejectCancel}
            disabled={actionLoading}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleRejectConfirm}
            disabled={actionLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {actionLoading ? "Rejecting..." : "Confirm Rejection"}
          </button>
        </div>
      )}
    </div>
  );
};
