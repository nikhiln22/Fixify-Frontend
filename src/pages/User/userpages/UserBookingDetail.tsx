import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import { UserProfileSidebar } from "../../../components/user/UserProfileSidebar";
import Button from "../../../components/common/Button";
import { bookingDetails, getRating } from "../../../services/common.services";
import { showToast } from "../../../utils/toast";
import { IBooking } from "../../../models/booking";
import { BookingHeader } from "../../../components/common/BookingHeader";
import { BookingStatusCard } from "../../../components/common/BookingStatusCard";
import { ServiceDetailsCard } from "../../../components/common/ServiceDetailsCard";
import TechnicianCard from "../../../components/user/TechncianCard";
import { AddressCard } from "../../../components/user/AddressCard";
import { ScheduleInfoCard } from "../../../components/common/ScheduledInfoCard";
import { CancellationCard } from "../../../components/common/CancellationCard";
import { IRating } from "../../../models/IRating";
import { RatingCard } from "../../../components/common/RatingCard";

export const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [rating, setRating] = useState<IRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingDetails(id!, "USER");
      console.log("response in the userbooking details page:", response);

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
      const ratingResponse = await getRating(id!, "user");
      console.log("Rating response:", ratingResponse);

      if (ratingResponse.success) {
        setRating(ratingResponse.data);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/user/bookings");
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex h-full">
          <UserProfileSidebar />
          <div className="flex-1 p-8">
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
      </UserLayout>
    );
  }

  if (error || !booking) {
    return (
      <UserLayout>
        <div className="flex h-full">
          <UserProfileSidebar />
          <div className="flex-1 p-8">
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
      </UserLayout>
    );
  }

  const technicianData = booking.technicianId
    ? {
        id: booking.technicianId._id || "",
        name: booking.technicianId.username || "N/A",
        experience: Number(booking.technicianId.yearsOfExperience) || 0,
        designation:
          booking.technicianId.Designation?.designation || "Not specified",
        profileImage: booking.technicianId.image || "/default-avatar.png",
        verified: booking.technicianId.is_verified || false,
      }
    : null;

  return (
    <UserLayout>
      <div className="flex h-full">
        <UserProfileSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            <BookingHeader onBackClick={handleBackClick} />

            <BookingStatusCard
              bookingDate={booking.createdAt}
              paymentMethod={booking.paymentId?.paymentMethod}
              status={booking.bookingStatus}
              bookingId={booking._id}
              paymentStatus={booking.paymentId.paymentStatus}
            />

            {booking.bookingStatus === "Cancelled" && (
              <CancellationCard
                bookingStatus={booking.bookingStatus}
                cancellationDate={booking.cancellationDate}
                cancellationReason={booking.cancellationReason}
                refundStatus={booking.paymentId?.refundStatus}
                refundDate={booking.paymentId?.refundDate}
                refundAmount={booking.paymentId?.refundAmount}
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
                    Technician Details
                  </h2>
                </div>
                {technicianData ? (
                  <TechnicianCard
                    technician={technicianData}
                    showBookButton={false}
                  />
                ) : (
                  <div className="p-6">
                    <p className="text-gray-500">No technician assigned yet</p>
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
                      fullAddress: booking.addressId.fullAddress,
                      landmark: booking.addressId.landmark,
                      addressType: booking.addressId.addressType as
                        | "Home"
                        | "Work",
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
    </UserLayout>
  );
};
