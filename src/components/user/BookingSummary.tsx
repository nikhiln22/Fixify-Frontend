import React from "react";
import Button from "../common/Button";
import { BookingSummaryProps } from "../../types/component.types";
import { buildCloudinaryUrl } from "../../utils/cloudinary/cloudinary";
import { Ticket, ChevronRight, X, Info } from "lucide-react";

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
}) => {
  const serviceCharge =
    service.serviceType === "fixed"
      ? service.price || 0
      : service.hourlyRate || 0;

  const offerDiscount = offerData?.discountAmount || 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const totalDiscountAmount = offerDiscount + couponDiscount;
  const totalAmount = serviceCharge - totalDiscountAmount;
  const hasDiscount = offerData?.offerApplied || appliedCoupon;

  const isHourlyService = service.serviceType === "hourly";

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
    if (service.serviceType === "fixed") {
      return totalAmount;
    } else if (service.serviceType === "hourly") {
      return 300;
    }
    return 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Booking Summary
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

      {isHourlyService && (
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

      {!isHourlyService && appliedCoupon && (
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

      {!isHourlyService && offerData?.offerApplied && (
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

      {!isHourlyService && (
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
                    : "view all coupons"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Charge:</span>
          <span className="font-medium">
            {isHourlyService ? `₹${serviceCharge}/hr` : `₹${serviceCharge}`}
          </span>
        </div>

        {isHourlyService && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Advance Payment:</span>
            <span className="font-medium">₹{getAdvanceAmount()}</span>
          </div>
        )}

        {!isHourlyService && offerData?.offerApplied && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Offer Discount:</span>
            <span className="font-medium text-green-600">
              -₹{offerDiscount}
            </span>
          </div>
        )}

        {!isHourlyService && appliedCoupon && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Coupon Discount:</span>
            <span className="font-medium text-green-600">
              -₹{couponDiscount}
            </span>
          </div>
        )}

        {!isHourlyService && hasDiscount && (
          <div className="flex justify-between text-sm font-medium">
            <span className="text-green-600">Total Savings:</span>
            <span className="text-green-600">-₹{totalDiscountAmount}</span>
          </div>
        )}

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-semibold">
          <span>
            {isHourlyService ? "Amount to Pay Now:" : "Total Amount:"}
          </span>
          <span className="text-black">₹{getAdvanceAmount()}</span>
        </div>

        {isHourlyService && (
          <div className="text-xs text-gray-500 mt-2">
            Remaining amount will be calculated based on actual hours worked and
            charged after service completion
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
          {isLoading ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};
