import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import Button from "../../../components/common/Button";
import Banner from "../../../components/common/Banner";
import { verifyPaymentSession } from "../../../services/bookingService";
import { showToast } from "../../../utils/toast";
import dayjs from "dayjs";
import { IBooking } from "../../../models/booking";
import technicianBanner from "../../../assets/technician Banner.png";
import { CheckCircle, Clock, Calendar } from "lucide-react";

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
          const res = await verifyPaymentSession(sessionId);
          if (res.success && res.data) {
            setBooking(res.data);
            showToast({
              type: "success",
              message: "Final payment completed successfully!",
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

  // ✅ Calculate duration in hours from start and end times
  const calculateDurationInHours = (): number => {
    if (!booking?.serviceStartTime || !booking?.serviceEndTime) return 0;

    const startTime = new Date(booking.serviceStartTime).getTime();
    const endTime = new Date(booking.serviceEndTime).getTime();
    const durationInMs = endTime - startTime;
    const durationInHours = durationInMs / (1000 * 60 * 60);

    return durationInHours;
  };

  // ✅ Format duration for display
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

  // ✅ Calculate billed hours
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

  const billedHours = calculateBilledHours();
  const hasServiceDuration = booking.serviceStartTime && booking.serviceEndTime;

  return (
    <UserLayout>
      <Banner backgroundImage={technicianBanner} height="400px" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
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
                Your service has been completed and payment processed
              </p>

              {/* Payment Summary */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <p className="text-sm text-green-700 mb-2">Amount Paid</p>
                <p className="text-4xl font-bold text-green-900">
                  ₹{booking.bookingAmount.toFixed(2)}
                </p>
                {payment?.advanceAmount && (
                  <p className="text-sm text-green-700 mt-2">
                    (Includes ₹{payment.advanceAmount} advance paid earlier)
                  </p>
                )}
              </div>

              {/* Transaction Details */}
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
                {service?.serviceType === "hourly" && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Service Type</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      Hourly Service
                    </span>
                  </div>
                )}
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

              {hasServiceDuration && (
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
          {service?.serviceType === "hourly" && hasServiceDuration && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Breakdown
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-medium">
                    ₹{service.hourlyRate}/hour
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billed Hours</span>
                  <span className="font-medium">× {billedHours}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-3">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-gray-900">
                    ₹{(billedHours * (service.hourlyRate || 0)).toFixed(2)}
                  </span>
                </div>
                {payment?.advanceAmount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Advance Paid</span>
                    <span>- ₹{payment.advanceAmount.toFixed(2)}</span>
                  </div>
                )}
                {payment?.originalAmount &&
                  payment.amountPaid &&
                  payment.originalAmount > payment.amountPaid && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discounts Applied</span>
                      <span>
                        - ₹
                        {(payment.originalAmount - payment.amountPaid).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}
                <div className="flex justify-between text-lg font-bold border-t-2 pt-3">
                  <span className="text-gray-900">Final Amount Paid</span>
                  <span className="text-green-600">
                    ₹{booking.bookingAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
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
