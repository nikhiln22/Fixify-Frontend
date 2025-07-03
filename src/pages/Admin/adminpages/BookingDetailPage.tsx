import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import { bookingDetails } from "../../../services/common.services";
import { showToast } from "../../../utils/toast";
import { IBooking } from "../../../models/booking";
import { BookingHeader } from "../../../components/common/BookingHeader";
import { BookingStatusCard } from "../../../components/common/BookingStatusCard";
import { ServiceDetailsCard } from "../../../components/common/ServiceDetailsCard";
import TechnicianCard from "../../../components/user/TechncianCard";
import { AddressCard } from "../../../components/user/AddressCard";
import { ScheduleInfoCard } from "../../../components/common/ScheduledInfoCard";
import { CustomerInfoCard } from "../../../components/technician/CustomerInfoCard";
import { CancellationCard } from "../../../components/common/CancellationCard";
import { RevenueDetailCard } from "../../../components/admin/RevenueDetailCard";
import { DollarSign } from "lucide-react";

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
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
      const response = await bookingDetails(bookingId!, "ADMIN");

      if (response.success) {
        setBooking(response.data);
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

  const handleBackClick = () => {
    navigate("/admin/bookings");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !booking) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Booking not found"}
            </h1>
            <Button onClick={handleBackClick} variant="primary">
              Back to Bookings
            </Button>
          </div>
        </div>
      </AdminLayout>
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

  const customerData = booking.userId
    ? {
        name: booking.userId.username || "N/A",
        phone: booking.userId.phone || "N/A",
        email: booking.userId.email || "N/A",
      }
    : null;

  const shouldShowRevenueDetails =
    booking.bookingStatus === "Completed" &&
    booking.technicianId &&
    booking.paymentId?.paymentStatus === "Paid";

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="space-y-6">
          <BookingHeader onBackClick={handleBackClick} userType="admin" />

          <BookingStatusCard
            bookingDate={booking.createdAt}
            paymentMethod={booking.paymentId?.paymentMethod}
            status={booking.bookingStatus}
            bookingId={booking._id}
            paymentStatus={booking.paymentId.paymentStatus}
            userType="admin"
          />

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

            {shouldShowRevenueDetails ? (
              <RevenueDetailCard
                totalAmount={
                  booking.paymentId?.amountPaid || booking.bookingAmount
                }
                fixifyShare={booking.paymentId?.fixifyShare || 0}
                technicianShare={booking.paymentId?.technicianShare || 0}
                paymentMethod={booking.paymentId?.paymentMethod || "N/A"}
                paymentStatus={booking.paymentId?.paymentStatus || "N/A"}
                technicianPaid={booking.paymentId?.technicianPaid || false}
                technicianPaidAt={booking.paymentId?.technicianPaidAt}
                bookingStatus={booking.bookingStatus}
              />
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Revenue Details
                      </h2>
                      <p className="text-sm text-gray-500">Not available yet</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <DollarSign className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Revenue Details Not Available
                    </h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">
                      Revenue breakdown will be available once the booking is
                      completed, payment is processed.
                    </p>
                    <div className="mt-4 text-xs text-gray-400">
                      <p>
                        Current Status:{" "}
                        <span className="font-medium">
                          {booking.bookingStatus}
                        </span>
                      </p>
                      <p>
                        Payment Status:{" "}
                        <span className="font-medium">
                          {booking.paymentId?.paymentStatus || "N/A"}
                        </span>
                      </p>
                      <p>
                        Technician:{" "}
                        <span className="font-medium">
                          {booking.technicianId ? "Assigned" : "Not Assigned"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <CancellationCard
            bookingStatus={booking.bookingStatus}
            cancellationDate={booking.cancellationDate}
            refundStatus={booking.paymentId?.refundStatus}
            refundDate={booking.paymentId?.refundDate}
            refundAmount={booking.refundAmount}
            originalAmount={
              booking.paymentId?.amountPaid || booking.bookingAmount
            }
          />
        </div>
      </div>
    </AdminLayout>
  );
};
