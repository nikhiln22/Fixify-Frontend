import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../../../layouts/UserLayout';
import { UserProfileSidebar } from '../../../components/user/UserProfileSidebar';
import Button from '../../../components/common/Button';
import { bookingDetails } from '../../../services/user.services';
import { showToast } from '../../../utils/toast';
import { IBooking } from '../../../models/booking';

export const BookingDetailsPage: React.FC = () => {
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
      const response = await bookingDetails(bookingId!);
      
      if (response.success) {
        setBooking(response.data);
      } else {
        setError(response.message);
        showToast({
          message: response.message,
          type: 'error'
        });
      }
    } catch (error: any) {
      setError('Failed to fetch booking details');
      showToast({
        message: 'Failed to fetch booking details',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex min-h-screen bg-gray-50">
          <div className="w-64 flex-shrink-0 p-12 pl-42">
            <UserProfileSidebar />
          </div>
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
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
        </div>
      </UserLayout>
    );
  }

  if (error || !booking) {
    return (
      <UserLayout>
        <div className="flex min-h-screen bg-gray-50">
          <div className="w-64 flex-shrink-0 p-12 pl-42">
            <UserProfileSidebar />
          </div>
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {error || 'Booking not found'}
                </h1>
                <Button
                  onClick={() => navigate('/user/bookinglist')}
                  variant="primary"
                >
                  Back to Bookings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0 p-12 pl-42">
          <UserProfileSidebar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                <p className="text-gray-600">#{booking._id.slice(-8).toUpperCase()}</p>
              </div>
              <Button
                onClick={() => navigate('/user/bookinglist')}
                variant="outline"
              >
                Back to Bookings
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Booking Information</h2>
                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Booking Date</h3>
                  <p className="text-lg text-gray-900 mt-1">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Method</h3>
                  <p className="text-lg text-gray-900 mt-1">{booking.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Name</h3>
                    <p className="text-lg text-gray-900 mt-1">{booking.serviceId?.name || 'N/A'}</p>
                  </div>
                  {booking.serviceId?.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</h3>
                      <p className="text-gray-700 mt-1">{booking.serviceId.description}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Price</h3>
                    <p className="text-lg text-gray-900 mt-1">₹{booking.serviceId?.price || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Amount</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{booking.totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Technician Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</h3>
                    <p className="text-lg text-gray-900 mt-1">{booking.technicianId?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
                    <p className="text-gray-700 mt-1">{booking.technicianId?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</h3>
                    <p className="text-gray-700 mt-1">{booking.technicianId?.phone || 'N/A'}</p>
                  </div>
                  {/* <div className="pt-2">
                    <Button
                      onClick={() => window.open(`tel:${booking.technicianId?.phone}`, '_self')}
                      variant="outline"
                      className="w-full"
                      disabled={!booking.technicianId?.phone}
                    >
                      📞 Contact Technician
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Information</h2>
                <div className="space-y-4">
                  {booking.timeSlotId ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Date</h3>
                        <p className="text-lg text-gray-900 mt-1">
                          {formatDate(booking.timeSlotId.date)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Time Slot</h3>
                        <p className="text-lg text-gray-900 mt-1">
                          {formatTime(booking.timeSlotId.startTime)} - {formatTime(booking.timeSlotId.endTime)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</h3>
                        <p className="text-gray-700 mt-1">
                          {booking.timeSlotId.isBooked ? 'Confirmed' : 'Pending Confirmation'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Time slot details not available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Address</h2>
                <div className="space-y-4">
                  {booking.addressId ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</h3>
                        <p className="text-gray-700 mt-1">{booking.addressId.fullAddress}</p>
                      </div>
                      {booking.addressId.landmark && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Landmark</h3>
                          <p className="text-gray-700 mt-1">{booking.addressId.landmark}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Address details not available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {booking.bookingStatus === 'Pending' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      showToast({
                        message: 'Cancel booking functionality coming soon',
                        type: 'info'
                      });
                    }}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel Booking
                  </Button>
                  {/* <Button
                    onClick={() => {
                      showToast({
                        message: 'Reschedule functionality coming soon',
                        type: 'info'
                      });
                    }}
                    variant="outline"
                  >
                    Reschedule
                  </Button> */}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you have any questions about your booking, feel free to contact our support team.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => window.open('tel:+919876543210', '_self')}
                  variant="outline"
                  className="text-blue-600 border-blue-300"
                >
                  📞 Call Support
                </Button>
                <Button
                  onClick={() => window.open('mailto:support@fixify.com', '_self')}
                  variant="outline"
                  className="text-blue-600 border-blue-300"
                >
                  ✉️ Email Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};