import React, { useState, useEffect } from "react";
import { IPart } from "../../models/parts";

interface SelectedPart {
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface AddReplacementPartsProps {
  parts: IPart[];
  loading: boolean;
  onPartsChange: (selectedParts: SelectedPart[], totalAmount: number) => void;
}

export const AddReplacementParts: React.FC<AddReplacementPartsProps> = ({
  parts,
  loading,
  onPartsChange,
}) => {
  const [selectedParts, setSelectedParts] = useState<Map<string, SelectedPart>>(
    new Map()
  );

  // ✅ Move calculateTotal inside useEffect to avoid stale closure
  useEffect(() => {
    const calculateTotal = (): number => {
      let total = 0;
      selectedParts.forEach(({ totalPrice }) => {
        total += totalPrice;
      });
      return total;
    };

    const partsArray = Array.from(selectedParts.values());
    const total = calculateTotal();
    onPartsChange(partsArray, total);
  }, [selectedParts, onPartsChange]); // ✅ Now includes all dependencies

  const handlePartToggle = (part: IPart) => {
    const newSelectedParts = new Map(selectedParts);

    if (newSelectedParts.has(part._id)) {
      newSelectedParts.delete(part._id);
    } else {
      newSelectedParts.set(part._id, {
        partId: part._id,
        partName: part.name,
        quantity: 1,
        unitPrice: part.price,
        totalPrice: part.price * 1,
      });
    }

    setSelectedParts(newSelectedParts);
  };

  const handleQuantityChange = (partId: string, quantity: number) => {
    const newSelectedParts = new Map(selectedParts);
    const selectedPart = newSelectedParts.get(partId);

    if (selectedPart && quantity > 0) {
      newSelectedParts.set(partId, {
        ...selectedPart,
        quantity,
        totalPrice: selectedPart.unitPrice * quantity,
      });
      setSelectedParts(newSelectedParts);
    }
  };

  // ✅ Keep this function outside useEffect for use in the render
  const calculateTotal = (): number => {
    let total = 0;
    selectedParts.forEach(({ totalPrice }) => {
      total += totalPrice;
    });
    return total;
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading available parts...
          </p>
        </div>
      )}

      {!loading && parts.length === 0 && (
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
          <p className="mt-4 text-lg text-gray-600 font-medium">
            No parts available
          </p>
          <p className="text-sm text-gray-500 mt-1">
            There are no parts configured for this service yet
          </p>
        </div>
      )}

      {!loading && parts.length > 0 && (
        <>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {parts.map((part) => {
              const isSelected = selectedParts.has(part._id);
              const selectedPart = selectedParts.get(part._id);

              return (
                <div
                  key={part._id}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePartToggle(part)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {part.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {part.description}
                          </p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            ₹{part.price.toFixed(2)}
                            <span className="text-sm font-normal text-gray-500">
                              {" "}
                              per unit
                            </span>
                          </p>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-3 ml-4">
                            <div className="flex flex-col items-end">
                              <label className="text-xs text-gray-600 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="999"
                                value={selectedPart?.quantity || 1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    part._id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div className="text-right ml-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Subtotal
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                ₹{selectedPart?.totalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedParts.size > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Selected Parts
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedParts.size} item(s)
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {Array.from(selectedParts.values()).map((selectedPart) => (
                    <div
                      key={selectedPart.partId}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">
                        {selectedPart.partName} × {selectedPart.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{selectedPart.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                  <p className="text-sm text-yellow-800">
                    These parts will be sent to the customer for approval before
                    proceeding with the replacement.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};