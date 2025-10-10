import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import Button from "../../../components/common/Button";
import { BookingSummary } from "../../../components/user/BookingSummary";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "../../../components/user/PaymentMethodSelector";
import { CouponModal } from "../../../components/user/CouponModal";
import { IBooking } from "../../../models/booking";
import {
  bookingDetails,
  completeFinalPayment,
} from "../../../services/bookingService";
import { applyBestOffer } from "../../../services/offerService";
import {
  getEligibleCoupons,
  applyCoupon,
} from "../../../services/couponService";
import { CouponData, OfferData } from "../../../types/user.types";
import technicianBanner from "../../../assets/technician Banner.png";
import {
  Clock,
  Calendar,
  User,
  Wrench,
  CheckCircle,
  Package,
} from "lucide-react";

export const UserFinalPayment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  const [hourlyRate, setHourlyRate] = useState(0);
  const [actualDuration, setActualDuration] = useState(0);
  const [billedHours, setBilledHours] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(300);
  const [partsAmount, setPartsAmount] = useState(0);
  const [isHourlyService, setIsHourlyService] = useState(false); // ✅ Track if hourly service

  const [currentOffer, setCurrentOffer] = useState<OfferData | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [eligibleCoupons, setEligibleCoupons] = useState<CouponData[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [serviceStartTime, setServiceStartTime] = useState<Date | null>(null);
  const [serviceEndTime, setServiceEndTime] = useState<Date | null>(null);

  const calculatePaymentBreakdown = useCallback(() => {
    if (!booking) return;

    // ✅ Only calculate hourly charges if it's an hourly service
    if (isHourlyService && booking.serviceStartTime && booking.serviceEndTime) {
      const startTime = new Date(booking.serviceStartTime).getTime();
      const endTime = new Date(booking.serviceEndTime).getTime();
      const durationInMs = endTime - startTime;
      const durationInHours = durationInMs / (1000 * 60 * 60);

      setActualDuration(durationInHours);

      const billed = Math.max(1, Math.ceil(durationInHours));
      setBilledHours(billed);

      const total = billed * hourlyRate;
      setSubtotal(total);
    } else {
      // ✅ For fixed services, no service charges (already paid)
      setSubtotal(0);
      setBilledHours(0);
      setActualDuration(0);
    }

    // ✅ Set parts amount if parts were approved
    if (
      booking.hasReplacementParts &&
      booking.replacementPartsApproved === true
    ) {
      setPartsAmount(booking.totalPartsAmount || 0);
    } else {
      setPartsAmount(0);
    }
  }, [booking, hourlyRate, isHourlyService]);

  const applyBestOfferForFinalPayment = useCallback(async () => {
    // ✅ Only apply offers for hourly services with service charges
    if (!booking || !booking.serviceId || !isHourlyService || subtotal <= 0)
      return;

    try {
      setIsLoadingOffer(true);

      const serviceId =
        typeof booking.serviceId === "string"
          ? booking.serviceId
          : booking.serviceId._id;

      // ✅ Apply offer ONLY to service subtotal, NOT parts
      const offerResponse = await applyBestOffer(serviceId, subtotal);
      console.log("Offer response for final payment:", offerResponse);

      if (offerResponse?.success && offerResponse.data) {
        const newOffer: OfferData = {
          offerId: offerResponse.data.offerId,
          offerApplied: offerResponse.data.offerApplied,
          offerName: offerResponse.data.offerName,
          discountAmount: offerResponse.data.discountAmount,
          finalAmount: offerResponse.data.finalAmount,
          discountValue: offerResponse.data.discountValue,
          maxDiscount: offerResponse.data.maxDiscount,
          discountType: offerResponse.data.discountType,
          offerType: offerResponse.data.offerType,
          minBookingAmount: offerResponse.data.minBookingAmount,
        };
        setCurrentOffer(newOffer);
        console.log("Offer applied:", newOffer);
      }
    } catch (error) {
      console.error("Error applying offer:", error);
    } finally {
      setIsLoadingOffer(false);
    }
  }, [booking, subtotal, isHourlyService]);

  const fetchBookingDetails = useCallback(async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const response = await bookingDetails(bookingId);

      console.log("Booking details response:", response);

      if (response.success && response.data) {
        const bookingData = response.data;

        if (bookingData.bookingStatus !== "Payment Pending") {
          showToast({
            message: "This booking does not require payment",
            type: "warning",
          });
          navigate("/user/bookings");
          return;
        }

        setBooking(bookingData);

        // ✅ Check if hourly service
        const isHourly =
          typeof bookingData.serviceId === "object" &&
          bookingData.serviceId.serviceType === "hourly";

        setIsHourlyService(isHourly);

        if (isHourly) {
          // For hourly services
          if (bookingData.serviceStartTime) {
            setServiceStartTime(new Date(bookingData.serviceStartTime));
          }
          if (bookingData.serviceEndTime) {
            setServiceEndTime(new Date(bookingData.serviceEndTime));
          }

          if (
            typeof bookingData.serviceId === "object" &&
            bookingData.serviceId.hourlyRate
          ) {
            setHourlyRate(bookingData.serviceId.hourlyRate);
          }

          if (typeof bookingData.paymentId === "object") {
            setAdvancePaid(bookingData.paymentId.advanceAmount || 300);
          }
        } else {
          // ✅ For fixed services - payment is ONLY for parts
          setAdvancePaid(bookingData.bookingAmount || 0); // Full service already paid
        }
      } else {
        showToast({
          message: response.message || "Failed to fetch booking details",
          type: "error",
        });
        navigate("/user/bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      showToast({
        message: "Failed to load booking details. Please try again.",
        type: "error",
      });
      navigate("/user/bookings");
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  useEffect(() => {
    if (booking) {
      calculatePaymentBreakdown();
    }
  }, [booking, calculatePaymentBreakdown]);

  useEffect(() => {
    // ✅ Only apply offers for hourly services
    if (isHourlyService && subtotal > 0 && booking?.serviceId) {
      applyBestOfferForFinalPayment();
    }
  }, [
    subtotal,
    booking?.serviceId,
    isHourlyService,
    applyBestOfferForFinalPayment,
  ]);

  const handleFetchCoupons = async () => {
    // ✅ Only allow coupons for hourly services
    if (!isHourlyService) {
      showToast({
        message: "Coupons are not applicable for parts-only payments",
        type: "info",
      });
      return;
    }

    if (!booking?.serviceId) {
      console.log("No service ID found");
      return;
    }

    try {
      setIsLoadingCoupons(true);

      const serviceId =
        typeof booking.serviceId === "string"
          ? booking.serviceId
          : booking.serviceId._id;

      console.log("Fetching eligible coupons for service:", serviceId);

      const couponResponse = await getEligibleCoupons(serviceId);
      console.log("Eligible coupons response:", couponResponse);

      if (couponResponse?.success && couponResponse.data) {
        setEligibleCoupons(couponResponse.data);
        setIsCouponModalOpen(true);
        console.log("Coupons loaded:", couponResponse.data);
      } else {
        showToast({
          message: "No coupons available for this service",
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error fetching eligible coupons:", error);
      showToast({
        message: "Failed to fetch coupons",
        type: "error",
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleApplyCoupon = async (
    newCoupon: CouponData,
    currentCoupon: CouponData | null = null
  ) => {
    if (!booking?.serviceId || !isHourlyService) return;

    try {
      console.log("Applying coupon:", newCoupon);
      console.log("Current coupon:", currentCoupon);

      const serviceId =
        typeof booking.serviceId === "string"
          ? booking.serviceId
          : booking.serviceId._id;

      const response = await applyCoupon(serviceId, newCoupon.couponId);
      console.log("Apply coupon response:", response);

      if (response?.success && response.data) {
        setAppliedCoupon({
          ...newCoupon,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount,
          couponId: newCoupon.couponId,
        });

        showToast({
          message: response.message || "Coupon applied successfully!",
          type: "success",
        });
      } else {
        showToast({
          message: response?.message || "Failed to apply coupon",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      showToast({
        message: "Failed to apply coupon. Please try again.",
        type: "error",
      });
    }
  };

  const handleRemoveCoupon = () => {
    if (!appliedCoupon) return;
    setAppliedCoupon(null);
    showToast({
      message: "Coupon removed successfully",
      type: "success",
    });
  };

  const handleCloseCouponModal = () => {
    setIsCouponModalOpen(false);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const calculateFinalAmount = () => {
    let finalAmount = 0;

    if (isHourlyService) {
      // ✅ For hourly services: service charges + parts - advance - discounts
      finalAmount = subtotal + partsAmount;
      finalAmount = finalAmount - advancePaid;

      // Apply offer discount (only on service charges)
      if (currentOffer?.offerApplied && currentOffer.discountAmount) {
        finalAmount = finalAmount - currentOffer.discountAmount;
      }

      // Apply coupon discount (only on service charges)
      if (appliedCoupon?.discountAmount) {
        finalAmount = finalAmount - appliedCoupon.discountAmount;
      }
    } else {
      // ✅ For fixed services: ONLY parts amount (no discounts, service already paid)
      finalAmount = partsAmount;
    }

    return Math.max(0, finalAmount);
  };

  const handleConfirmPayment = async () => {
    if (!booking || !selectedPaymentMethod) {
      showToast({
        message: "Please select a payment method",
        type: "warning",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      const finalAmount = calculateFinalAmount();

      const paymentData = {
        bookingId: booking._id,
        paymentMethod: selectedPaymentMethod,
        finalAmount: finalAmount,
        offerId: currentOffer?.offerId || "",
        couponId: appliedCoupon?.couponId || "",
      };

      console.log("Sending final payment data to backend:", paymentData);

      const response = await completeFinalPayment(paymentData);

      if (response.success && response.data) {
        if (response.data.requiresPayment && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          showToast({
            message: "Payment completed successfully!",
            type: "success",
          });

          navigate("/user/finalpayment/success", {
            state: {
              booking: response.data.booking,
            },
          });
        }
      } else {
        showToast({
          message: response.message || "Failed to process payment",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      showToast({
        message: "Failed to process payment. Please try again.",
        type: "error",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""}`;
    }
    return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""} ${minutes} min${
      minutes !== 1 ? "s" : ""
    }`;
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </UserLayout>
    );
  }

  const service =
    booking && typeof booking.serviceId === "object" ? booking.serviceId : null;
  const technician =
    booking && typeof booking.technicianId === "object"
      ? booking.technicianId
      : null;
  const timeSlot =
    booking && Array.isArray(booking.timeSlotId)
      ? booking.timeSlotId[0]
      : booking?.timeSlotId;

  if (!booking || !service) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The booking you're looking for doesn't exist or service
              information is unavailable.
            </p>
            <Button
              onClick={() => navigate("/user/bookings")}
              variant="primary"
            >
              Go to My Bookings
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const isPaymentReady = selectedPaymentMethod;

  return (
    <UserLayout>
      <Banner backgroundImage={technicianBanner} height="400px" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Final Payment
          </h1>
          <p className="text-gray-600">
            {isHourlyService
              ? "Review service duration and complete your payment"
              : "Complete payment for replacement parts"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-green-900">
                    Service Completed
                  </h2>
                  <p className="text-sm text-green-700">
                    Technician has finished the service
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Service Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Wrench className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-medium text-gray-900">{service.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Technician</p>
                    <p className="font-medium text-gray-900">
                      {technician?.username || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Service Date</p>
                    <p className="font-medium text-gray-900">
                      {typeof timeSlot === "object"
                        ? formatDate(timeSlot.date)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Only show duration for hourly services */}
            {isHourlyService && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Service Duration
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Start Time</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatTime(serviceStartTime)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">End Time</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatTime(serviceEndTime)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">
                      Actual Duration
                    </p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatDuration(actualDuration)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Billed Hours</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {billedHours} hour{billedHours !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-blue-800 bg-blue-100 p-3 rounded-lg">
                  ℹ️ Minimum 1 hour billing applies. Actual duration is rounded
                  up to the nearest hour.
                </div>
              </div>
            )}

            {/* ✅ Replacement Parts Section */}
            {partsAmount > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Replacement Parts
                </h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">
                        Parts Approved
                      </p>
                      <p className="text-xs text-gray-500">
                        {isHourlyService
                          ? "Additional parts used during service"
                          : "Parts used for this service"}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-purple-900">
                      ₹{partsAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-purple-800 bg-purple-100 p-3 rounded-lg mt-4">
                  ✓ You have approved these replacement parts
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Breakdown
              </h3>
              <div className="space-y-3">
                {/* ✅ Only show service charges for hourly services */}
                {isHourlyService && (
                  <>
                    <div className="flex justify-between text-sm pb-3 border-b">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span className="font-medium">₹{hourlyRate}/hour</span>
                    </div>
                    <div className="flex justify-between text-sm pb-3 border-b">
                      <span className="text-gray-600">Billed Hours</span>
                      <span className="font-medium">× {billedHours}</span>
                    </div>
                    <div className="flex justify-between font-semibold pb-3 border-b">
                      <span>Service Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {/* ✅ Parts line item */}
                {partsAmount > 0 && (
                  <div className="flex justify-between text-sm pb-3 border-b">
                    <span className="text-gray-600">Replacement Parts</span>
                    <span className="font-medium">
                      ₹{partsAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* ✅ Total before deductions (only for hourly) */}
                {isHourlyService && (
                  <>
                    <div className="flex justify-between font-semibold text-lg pb-3 border-b">
                      <span>Total Amount</span>
                      <span>₹{(subtotal + partsAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 pb-3 border-b">
                      <span>Advance Already Paid</span>
                      <span>- ₹{advancePaid.toFixed(2)}</span>
                    </div>
                    {currentOffer?.offerApplied && (
                      <div className="flex justify-between text-sm text-green-600 pb-3 border-b">
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {currentOffer.offerName}
                        </span>
                        <span>
                          - ₹{currentOffer.discountAmount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600 pb-3 border-b">
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {appliedCoupon.code}
                        </span>
                        <span>
                          - ₹{appliedCoupon.discountAmount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* ✅ For fixed services, just show parts total */}
                {!isHourlyService && partsAmount > 0 && (
                  <div className="flex justify-between font-semibold text-lg pb-3 border-b">
                    <span>Total Parts Amount</span>
                    <span>₹{partsAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <PaymentMethodSelector
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              disabled={false}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              service={service}
              offerData={currentOffer}
              isLoadingOffer={isLoadingOffer}
              appliedCoupon={appliedCoupon}
              onConfirmBooking={handleConfirmPayment}
              onFetchCoupons={handleFetchCoupons}
              onRemoveCoupon={handleRemoveCoupon}
              isLoading={isProcessingPayment}
              disabled={!isPaymentReady}
              selectedPaymentMethod={selectedPaymentMethod}
              isLoadingCoupons={isLoadingCoupons}
              isFinalPayment={true}
              advancePaid={advancePaid}
              subtotal={subtotal}
              billedHours={billedHours}
              hourlyRate={hourlyRate}
              partsAmount={partsAmount}
              isHourlyService={isHourlyService}
            />
          </div>
        </div>
      </div>

      {/* ✅ Only show coupon modal for hourly services */}
      {isHourlyService && (
        <CouponModal
          isOpen={isCouponModalOpen}
          onClose={handleCloseCouponModal}
          coupons={eligibleCoupons}
          onApplyCoupon={handleApplyCoupon}
          appliedCoupon={appliedCoupon}
        />
      )}
    </UserLayout>
  );
};
