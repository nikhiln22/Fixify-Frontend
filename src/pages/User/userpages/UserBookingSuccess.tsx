import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserLayout from '../../../layouts/UserLayout';
import Button from '../../../components/common/Button';

export const UserBookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { newBooking} = location.state || {};

  useEffect(() => {
    if (!newBooking) {
      navigate('/user/bookings');
    }
  }, [newBooking, navigate]);

  if (!newBooking) {
    return null; 
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your service has been successfully booked
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Booking Details
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Booking ID
                    </h3>
                    <p className="text-lg font-mono text-gray-900 mt-1">
                      #{newBooking._id?.slice(-8) || 'XXXXXXXX'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Service
                    </h3>
                    <p className="text-lg text-gray-900 mt-1">
                      {newBooking.serviceId?.name || 'Service Name'}
                    </p>
                    {newBooking.serviceId?.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {newBooking.serviceId.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Technician
                    </h3>
                    <p className="text-lg text-gray-900 mt-1">
                      {newBooking.technicianId?.username || 'Technician Name'}
                    </p>
                    {newBooking.technicianId?.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {newBooking.technicianId.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Service Date & Time
                    </h3>
                    <p className="text-lg text-gray-900 mt-1">
                      {formatDate(newBooking.date)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Service Address
                    </h3>
                    <div className="text-sm text-gray-900 mt-1">
                      {newBooking.addressId ? (
                        <div>
                          <p>{newBooking.addressId.fullAddress}</p>
                          <p>{newBooking.addressId.city}, {newBooking.addressId.state} {newBooking.addressId.zipCode}</p>
                        </div>
                      ) : (
                        <p>Address details</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Total Amount
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{newBooking.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Payment Method: {newBooking.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/user/bookinglist')}
              variant="primary"
              className="px-8 py-3"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate('/user/services')}
              variant="outline"
              className="px-8 py-3"
            >
              Book Another Service
            </Button>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need help with your booking?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@fixify.com</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Verified Technician</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};