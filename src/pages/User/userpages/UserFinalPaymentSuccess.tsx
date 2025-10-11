import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import Button from "../../../components/common/Button";
import Banner from "../../../components/common/Banner";
import { verifyFinalPaymentStripeSession } from "../../../services/bookingService";
import { showToast } from "../../../utils/toast";
import dayjs from "dayjs";
import { IBooking } from "../../../models/booking";
import technicianBanner from "../../../assets/technician Banner.png";
import { CheckCircle, Clock, Calendar, Package } from "lucide-react";

export const UserFinalPaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (sessionId && !hasVerified.current) {
        hasVerified.current = true;
        try {
          const res = await verifyFinalPaymentStripeSession(sessionId);
          if (res.success && res.data?.booking) {
            setBooking(res.data.booking);
            showToast({
              type: "success",
              message: res.message || "Final payment completed successfully!",
            });
          } else {
            showToast({
              type: "error",
              message: res.message || "Payment verification failed",
            });
          }
        } catch (err) {
          console.error("Verification error:", err);
          showToast({
            type: "error",
            message: "Payment verification failed!",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (!sessionId) {
        showToast({
          type: "error",
          message: "Invalid payment session",
        });
        setIsLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  const calculateDurationInHours = (): number => {
    if (!booking?.serviceStartTime || !booking?.serviceEndTime) return 0;

    const startTime = new Date(booking.serviceStartTime).getTime();
    const endTime = new Date(booking.serviceEndTime).getTime();
    const durationInMs = endTime - startTime;
    const durationInHours = durationInMs / (1000 * 60 * 60);

    return durationInHours;
  };

  const formatDuration = (): string => {
    const hours = calculateDurationInHours();

    if (hours === 0) return "N/A";

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""}`;
    }
    return `${wholeHours} hour${wholeHours !== 1 ? "s" : ""} ${minutes} min${
      minutes !== 1 ? "s" : ""
    }`;
  };

  const calculateBilledHours = (): number => {
    const duration = calculateDurationInHours();
    if (duration === 0) return 0;
    return Math.max(1, Math.ceil(duration));
  };

  if (isLoading) {
    return (
      <UserLayout>
        <Banner backgroundImage={technicianBanner} height="400px" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Verifying payment...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!booking) {
    return (
      <UserLayout>
        <Banner backgroundImage={technicianBanner} height="400px" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate("/user/bookings")}
                variant="primary"
                className="px-6 py-2"
              >
                View My Bookings
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="px-6 py-2"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  const service =
    typeof booking.serviceId === "object" ? booking.serviceId : null;
  const technician =
    typeof booking.technicianId === "object" ? booking.technicianId : null;
  const timeSlot = Array.isArray(booking.timeSlotId)
    ? booking.timeSlotId[0]
    : booking.timeSlotId;
  const payment =
    typeof booking.paymentId === "object" ? booking.paymentId : null;

  const isHourlyService = service?.serviceType === "hourly";
  const billedHours = calculateBilledHours();
  const hasServiceDuration = booking.serviceStartTime && booking.serviceEndTime;
  const hasReplacementParts =
    booking.hasReplacementParts && booking.replacementPartsApproved === true;
  const partsAmount = booking.totalPartsAmount || 0;

  const finalPaymentAmount = payment?.amountPaid || 0;

  const serviceSubtotal = isHourlyService
    ? billedHours * (service?.hourlyRate || 0)
    : 0;

  return (
    <UserLayout>
      <Banner backgroundImage={technicianBanner} height="400px" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {isHourlyService
                  ? "Your service has been completed and final payment processed"
                  : "Payment for replacement parts completed successfully"}
              </p>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <p className="text-sm text-green-700 mb-2">
                  Final Payment Amount
                </p>
                <p className="text-4xl font-bold text-green-900">
                  ₹{payment?.amountPaid ? payment?.amountPaid.toFixed(2) : 0}
                </p>
                {payment?.advanceAmount && isHourlyService && (
                  <p className="text-sm text-green-700 mt-2">
                    (₹{payment.advanceAmount} advance paid earlier)
                  </p>
                )}
              </div>

              <div className="text-left space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Payment Date
                  </span>
                  <span className="text-gray-900 font-medium">
                    {dayjs().format("MMM DD, YYYY")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Payment Time
                  </span>
                  <span className="text-gray-900 font-medium">
                    {dayjs().format("hh:mm A")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-900 font-medium">
                    {payment?.paymentMethod || "Online"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="text-gray-900 font-medium font-mono text-sm">
                    {booking._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Service Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-medium text-gray-900">
                    {service?.name || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Service Type</p>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      isHourlyService
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {isHourlyService ? "Hourly Service" : "Fixed Service"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Technician</p>
                  <p className="font-medium text-gray-900">
                    {technician?.username || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Service Date</p>
                  <p className="font-medium text-gray-900">
                    {typeof timeSlot === "object"
                      ? dayjs(timeSlot.date, "DD-MM-YYYY").format(
                          "MMM DD, YYYY"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {hasServiceDuration && isHourlyService && (
                <>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Service Start Time
                      </p>
                      <p className="font-medium text-gray-900">
                        {dayjs(booking.serviceStartTime).format("hh:mm A")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Service End Time</p>
                      <p className="font-medium text-gray-900">
                        {dayjs(booking.serviceEndTime).format("hh:mm A")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Actual Duration</p>
                      <p className="font-medium text-gray-900">
                        {formatDuration()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Billed Hours</p>
                      <p className="font-medium text-gray-900">
                        {billedHours} hour{billedHours !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Breakdown
            </h2>
            <div className="space-y-3">
              {isHourlyService ? (
                <>
                  {/* Hourly Service Breakdown */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-medium">
                      ₹{service?.hourlyRate || 0}/hour
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Billed Hours</span>
                    <span className="font-medium">× {billedHours}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-3">
                    <span className="text-gray-900">Service Charges</span>
                    <span className="text-gray-900">
                      ₹{serviceSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {hasReplacementParts && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Replacement Parts
                      </span>
                      <span className="font-medium">
                        ₹{partsAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-medium border-t pt-3">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">
                      ₹{(serviceSubtotal + partsAmount).toFixed(2)}
                    </span>
                  </div>

                  {payment?.advanceAmount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Advance Already Paid</span>
                      <span>- ₹{payment.advanceAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* {payment?.offerDiscount && payment.offerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Offer Discount</span>
                      <span>- ₹{payment.offerDiscount.toFixed(2)}</span>
                    </div>
                  )} */}

                  {/* {payment?.couponDiscount && payment.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>- ₹{payment.couponDiscount.toFixed(2)}</span>
                    </div>
                  )} */}

                  <div className="flex justify-between text-lg font-bold border-t-2 pt-3">
                    <span className="text-gray-900">Final Payment</span>
                    <span className="text-green-600">
                      ₹{finalPaymentAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-800 mb-2">
                      Service payment was completed during booking
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-600">
                        Service Amount (Already Paid)
                      </span>
                      <span className="font-semibold text-purple-900">
                        ₹{booking.bookingAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {hasReplacementParts && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          Replacement Parts
                        </span>
                        <span className="font-medium">
                          ₹{partsAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-bold border-t-2 pt-3">
                        <span className="text-gray-900">
                          Parts Payment (This Payment)
                        </span>
                        <span className="text-green-600">
                          ₹{finalPaymentAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="text-xs text-blue-800">
                          <strong>Total Paid:</strong> ₹
                          {(booking.bookingAmount + finalPaymentAmount).toFixed(
                            2
                          )}{" "}
                          (Service + Parts)
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What's Next?
              </h3>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/user/bookings")}
                  variant="primary"
                  className="flex-1 py-3"
                >
                  View My Bookings
                </Button>
                {!booking.isRated && (
                  <Button
                    onClick={() => navigate(`/user/bookings/${booking._id}`)}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    Rate This Service
                  </Button>
                )}
              </div>

              <Button
                onClick={() => navigate("/user/categories")}
                variant="outline"
                className="w-full py-3"
              >
                Book Another Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
