import React from "react";
import Button from "../common/Button";
import { BookingSummaryProps } from "../../types/component.types";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import { Ticket, ChevronRight, X, Info, Package } from "lucide-react";

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  offerData,
  appliedCoupon,
  isLoadingOffer,
  onConfirmBooking,
  onFetchCoupons,
  onRemoveCoupon,
  isLoading = false,
  disabled = false,
  isLoadingCoupons,
  isFinalPayment = false,
  advancePaid = 0,
  subtotal = 0,
  billedHours = 0,
  hourlyRate = 0,
  partsAmount = 0,
  isHourlyService: isHourlyServiceProp,
}) => {
  const isHourlyService =
    isHourlyServiceProp ?? service.serviceType === "hourly";

  const getServiceCharge = (): number => {
    if (isFinalPayment && isHourlyService) {
      return subtotal;
    }
    return service.serviceType === "fixed"
      ? service.price || 0
      : service.hourlyRate || 0;
  };

  const serviceCharge = getServiceCharge();

  const offerDiscount = offerData?.discountAmount || 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const totalDiscountAmount = offerDiscount + couponDiscount;

  const calculateFinalAmount = (): number => {
    let amount = 0;

    if (isFinalPayment) {
      if (isHourlyService) {
        amount = serviceCharge + partsAmount;
        amount = amount - advancePaid;
        amount = amount - offerDiscount - couponDiscount;
      } else {
        amount = partsAmount;
      }
    } else {
      amount = serviceCharge;

      if (offerData?.offerApplied && offerData.finalAmount !== undefined) {
        amount = offerData.finalAmount;
      } else if (offerDiscount > 0) {
        amount = amount - offerDiscount;
      }

      if (couponDiscount > 0) {
        amount = amount - couponDiscount;
      }
    }

    return Math.max(0, amount);
  };

  const finalAmount = calculateFinalAmount();

  const hasDiscount = offerData?.offerApplied || appliedCoupon;

  const shouldShowCoupons = !isHourlyService || isFinalPayment;
  const shouldShowDiscounts = !isHourlyService || isFinalPayment;

  const getOfferDisplayMessage = () => {
    if (!offerData) return "";

    const { discountType, discountValue, minBookingAmount, discountAmount } =
      offerData;

    if (discountType === "percentage" && minBookingAmount) {
      return `${discountValue}% off (on bookings above ₹${minBookingAmount}) - You saved ₹${discountAmount}`;
    } else if (discountType === "percentage") {
      return `${discountValue}% off - You saved ₹${discountAmount}`;
    } else if (minBookingAmount) {
      return `₹${discountValue} off (on orders above ₹${minBookingAmount}) - You saved ₹${discountAmount}`;
    } else {
      return `₹${discountValue} off - You saved ₹${discountAmount}`;
    }
  };

  const getAdvanceAmount = (): number => {
    if (isFinalPayment) {
      return finalAmount;
    }

    if (service.serviceType === "fixed") {
      return finalAmount;
    } else if (service.serviceType === "hourly") {
      return 300;
    }
    return 0;
  };

  const getButtonText = (): string => {
    if (isLoading) return "Processing...";
    if (isFinalPayment) return "Complete Payment";
    return "Confirm Booking";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isFinalPayment ? "Payment Summary" : "Booking Summary"}
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          {service.image && (
            <img
              src={buildCloudinaryUrl(service.image)}
              alt={service.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-gray-600 mt-1">
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {isHourlyService && !isFinalPayment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-sm text-blue-700 font-medium">
                Hourly Service
              </span>
              <p className="text-xs text-blue-600 mt-1">
                Offers and coupons will be applied to your final bill after
                service completion
              </p>
            </div>
          </div>
        </div>
      )}

      {!isHourlyService && isFinalPayment && partsAmount > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Package className="w-4 h-4 text-purple-600 mt-0.5" />
            <div>
              <span className="text-sm text-purple-700 font-medium">
                Parts Payment Only
              </span>
              <p className="text-xs text-purple-600 mt-1">
                Service charges already paid. This payment is for replacement
                parts only.
              </p>
            </div>
          </div>
        </div>
      )}

      {shouldShowDiscounts && appliedCoupon && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <span className="text-sm text-green-700 font-medium">
                  Coupon {appliedCoupon.code} Applied!
                </span>
                <p className="text-xs text-green-600 mt-1">
                  You saved ₹{appliedCoupon.discountAmount}
                </p>
              </div>
            </div>
            {onRemoveCoupon && (
              <button
                onClick={onRemoveCoupon}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {shouldShowDiscounts && offerData?.offerApplied && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700 font-medium">
              {offerData.offerName} Applied!
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            {getOfferDisplayMessage()}
          </p>
        </div>
      )}

      {shouldShowCoupons && (
        <div
          onClick={onFetchCoupons}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                {isLoadingCoupons
                  ? "Loading..."
                  : appliedCoupon
                    ? "Change Coupon"
                    : "Apply Coupon"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {isFinalPayment ? (
          <>
            {isHourlyService && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-medium">₹{hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billed Hours:</span>
                  <span className="font-medium">× {billedHours}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Service Subtotal:</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
              </>
            )}

            {partsAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Replacement Parts:</span>
                <span className="font-medium">₹{partsAmount}</span>
              </div>
            )}

            {isHourlyService && (
              <>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-gray-900">
                    ₹{subtotal + partsAmount}
                  </span>
                </div>
                <hr className="my-2" />
              </>
            )}

            {isHourlyService && advancePaid > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Advance Paid:</span>
                <span className="font-medium text-green-600">
                  -₹{advancePaid}
                </span>
              </div>
            )}

            {shouldShowDiscounts &&
              offerData?.offerApplied &&
              offerDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Offer Discount:</span>
                  <span className="font-medium text-green-600">
                    -₹{offerDiscount}
                  </span>
                </div>
              )}

            {shouldShowDiscounts && appliedCoupon && couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Coupon Discount:</span>
                <span className="font-medium text-green-600">
                  -₹{couponDiscount}
                </span>
              </div>
            )}

            {shouldShowDiscounts && hasDiscount && (
              <div className="flex justify-between text-sm font-medium">
                <span className="text-green-600">Total Savings:</span>
                <span className="text-green-600">-₹{totalDiscountAmount}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Charge:</span>
              <span className="font-medium">
                {isHourlyService && !isFinalPayment
                  ? `₹${serviceCharge}/hr`
                  : `₹${serviceCharge}`}
              </span>
            </div>

            {offerData?.offerApplied && offerDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Offer Discount:</span>
                <span className="font-medium text-green-600">
                  -₹{offerDiscount}
                </span>
              </div>
            )}

            {appliedCoupon && couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Coupon Discount:</span>
                <span className="font-medium text-green-600">
                  -₹{couponDiscount}
                </span>
              </div>
            )}

            {hasDiscount && (
              <div className="flex justify-between text-sm font-medium">
                <span className="text-green-600">Total Savings:</span>
                <span className="text-green-600">-₹{totalDiscountAmount}</span>
              </div>
            )}
          </>
        )}

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-semibold">
          <span>
            {isFinalPayment
              ? "Amount to Pay:"
              : isHourlyService
                ? "Amount to Pay Now:"
                : "Total Amount:"}
          </span>
          <span className="text-black">₹{getAdvanceAmount()}</span>
        </div>

        {isHourlyService && !isFinalPayment && (
          <div className="text-xs text-gray-500 mt-2">
            Remaining amount will be calculated based on actual hours worked and
            charged after service completion
          </div>
        )}

        {!isHourlyService && isFinalPayment && partsAmount === 0 && (
          <div className="text-xs text-gray-500 mt-2">
            No additional charges. Service payment is complete.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={onConfirmBooking}
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={disabled || isLoading || isLoadingOffer}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
