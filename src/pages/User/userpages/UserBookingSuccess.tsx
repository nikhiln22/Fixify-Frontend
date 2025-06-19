import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import Button from "../../../components/common/Button";
import Banner from "../../../components/common/Banner";
import { verifyPaymentSession } from "../../../services/user.services";
import { showToast } from "../../../utils/toast";
import { IBooking } from "../../../models/booking";
import dayjs from "dayjs";

export const UserBookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (location.state?.booking) {
        setBooking(location.state.booking);
        setIsLoading(false);
        return;
      }

      if (sessionId && !hasVerified.current) {
        hasVerified.current = true;
        try {
          console.log("Verifying payment session:", sessionId);
          const res = await verifyPaymentSession(sessionId);
          if (res.success && res.data) {
            setBooking(res.data);
            showToast({ type: "success", message: "Payment Verified!" });
          } else {
            showToast({ type: "error", message: res.message });
          }
        } catch (err) {
          console.error("Verification error:", err);
          showToast({ type: "error", message: "Verification failed!" });
        } finally {
          setIsLoading(false);
        }
      } else if (!sessionId) {
        setIsLoading(false);
      }
    };
    
    verify();
  }, [sessionId, location.state]);

  if (isLoading) {
    return (
      <UserLayout>
        <Banner title="Verifying Payment..." height="400px" />
        <div className="text-center py-10 text-gray-600 text-lg">
          Please wait...
        </div>
      </UserLayout>
    );
  }

  if (!booking) {
    return (
      <UserLayout>
        <Banner title="Booking Confirmation" height="400px" />
        <div className="text-center py-10 text-red-500 text-lg">
          Booking not found or verification failed.
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Banner title="Booking Confirmation" height="400px" />

      <div className="min-h-screen bg-white py-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Great</h2>
          <p className="text-lg text-gray-600 mb-6">
            {location.state?.booking ? "Booking Confirmed" : "Payment Success"}
          </p>

          <div className="text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="text-gray-900 font-medium">
                {location.state?.paymentMethod || booking.paymentMethod || "Online"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900 font-medium">
                ₹{booking.totalAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-900 font-medium">
                {dayjs(booking.updatedAt || booking.createdAt).format("MMM DD, YYYY")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="text-gray-900 font-medium">
                {dayjs(booking.updatedAt || booking.createdAt).format("hh:mm A")}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <p className="text-lg font-semibold text-gray-900">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{booking.totalAmount}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/user/bookinglist")}
              variant="primary"
              className="px-8 py-3"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate("/user/services")}
              variant="outline"
              className="px-8 py-3"
            >
              Book Another Service
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};