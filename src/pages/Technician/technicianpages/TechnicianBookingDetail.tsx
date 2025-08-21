import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import Button from "../../../components/common/Button";
import { AddressCard } from "../../../components/user/AddressCard";
import { ScheduleInfoCard } from "../../../components/common/ScheduledInfoCard";
import { ServiceDetailsCard } from "../../../components/common/ServiceDetailsCard";
import { BookingStatusCard } from "../../../components/common/BookingStatusCard";
import { CustomerInfoCard } from "../../../components/technician/CustomerInfoCard";
import { BookingHeader } from "../../../components/common/BookingHeader";
import { bookingDetails, getRating } from "../../../services/commonServices";
import { showToast } from "../../../utils/toast";
import { IBooking } from "../../../models/booking";
import { CancellationCard } from "../../../components/common/CancellationCard";
import { IRating } from "../../../models/IRating";
import { RatingCard } from "../../../components/common/RatingCard";

export const TechnicianBookingDetail: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [rating, setRating] = useState<IRating | null>(null);
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingDetails(bookingId!, "TECHNICIAN");

      if (response.success) {
        setBooking(response.data);

        if (response.data.bookingStatus === "Completed") {
          fetchRating();
        }
      } else {
        setError(response.message);
        showToast({
          message: response.message,
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      setError("Failed to fetch booking details");
      showToast({
        message: "Failed to fetch booking details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const ratingResponse = await getRating(bookingId!, "technician");
      console.log("Rating response:", ratingResponse);

      if (ratingResponse.success) {
        setRating(ratingResponse.data);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/technician/jobs");
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  if (error || !booking) {
    return (
      <TechnicianLayout>
        <div className="flex h-full">
          <TechnicianProfileSidebar />
          <div className="flex-1 p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || "Booking not found"}
              </h1>
              <Button onClick={handleBackClick} variant="primary">
                Back to Bookings
              </Button>
            </div>
          </div>
        </div>
      </TechnicianLayout>
    );
  }

  const customerData = booking.userId
    ? {
        name: booking.userId.username || "N/A",
        phone: booking.userId.phone || "N/A",
        email: booking.userId.email || "N/A",
      }
    : null;

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <BookingHeader onBackClick={handleBackClick} />

            <BookingStatusCard
              bookingDate={booking.createdAt}
              status={booking.bookingStatus}
              bookingId={booking._id}
              userType="technician"
            />

            {booking.bookingStatus === "Cancelled" && (
              <CancellationCard
                bookingStatus={booking.bookingStatus}
                cancellationDate={booking.cancellationDate}
                cancellationReason={booking.cancellationReason}
                originalAmount={booking.bookingAmount}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ServiceDetailsCard
                serviceName={booking.serviceId?.name}
                description={booking.serviceId?.description}
                servicePrice={booking.serviceId?.price}
                totalAmount={
                  booking.paymentId?.amountPaid || booking.bookingAmount
                }
                serviceImage={booking.serviceId.image}
              />

              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Customer Details
                  </h2>
                </div>
                {customerData ? (
                  <div className="p-6">
                    <CustomerInfoCard
                      name={customerData.name}
                      phone={customerData.phone}
                      email={customerData.email}
                    />
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-gray-500">
                      No customer information available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScheduleInfoCard
                timeSlot={
                  booking.timeSlotId &&
                  booking.timeSlotId.date &&
                  booking.timeSlotId.startTime &&
                  booking.timeSlotId.endTime
                    ? {
                        date: booking.timeSlotId.date,
                        startTime: booking.timeSlotId.startTime,
                        endTime: booking.timeSlotId.endTime,
                      }
                    : undefined
                }
              />

              {booking.addressId && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Service Address
                  </h2>
                  <AddressCard
                    address={{
                      _id: booking.addressId._id,
                      addressType: booking.addressId.addressType as
                        | "Home"
                        | "Work",
                      fullAddress: booking.addressId.fullAddress,
                      landmark: booking.addressId.landmark,
                    }}
                    showActions={false}
                  />
                </div>
              )}
            </div>
            {booking.bookingStatus === "Completed" && (
              <RatingCard rating={rating} />
            )}
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};
