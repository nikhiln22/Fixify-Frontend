import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import { AddressCard } from "../../../components/user/AddressCard";
import TechnicianCard from "../../../components/user/TechncianCard";
import { UserTimeSlotSelection } from "../../../components/user/UserTimeSlotSelection";
import { BookingSummary } from "../../../components/user/BookingSummary";
import { PaymentMethodSelector, PaymentMethod } from "../../../components/user/PaymentMethodSelector";
import Button from "../../../components/common/Button";
import { getTimeSlots, bookService} from "../../../services/user.services";
import { ITimeSlot } from "../../../models/timeslot";
import { CreateBookingRequest } from "../../../types/user.types";

export const UserBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState<number>(0);
  
  const state = location.state;
  
  if (!state || !state.service || !state.address || !state.technician) {
    return (
      <UserLayout>
        <Banner title="Booking Error" height="400px" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No booking data found
            </h2>
            <p className="text-gray-600 mb-4">
              Please select a service and technician first.
            </p>
            <Button 
              onClick={() => navigate('/user/services')}
              variant="primary"
            >
              Browse Services
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const { service, address, technician} = state; 

  const fetchTimeSlots = async () => {
    try {
      setIsLoadingSlots(true);
      console.log('Fetching time slots for technician:', technician.id);
      
      const response = await getTimeSlots(technician.id, false);
      
      if (response.success) {
        setTimeSlots(response.data || []);
        setIsSlotModalOpen(true); 
        console.log('Fetched time slots:', response.data);
      } else {
        showToast({
          message: 'Failed to fetch available time slots',
          type: 'error'
        });
      }
      
    } catch (error) {
      console.error('Error fetching time slots:', error);
      showToast({
        message: 'Failed to fetch available time slots. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    console.log('Selected slot:', slot);
  };

  const handleCloseSlotModal = () => {
    setIsSlotModalOpen(false);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    console.log('Selected payment method:', method);
  };

  const handleTotalAmountChange = (amount: number) => {
    setCalculatedTotalAmount(amount);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      showToast({
        message: 'Please select a time slot first',
        type: 'warning'
      });
      return;
    }
    
    if (!selectedPaymentMethod) {
      showToast({
        message: 'Please select a payment method',
        type: 'warning'
      });
      return;
    }

    try {
      setIsConfirmingBooking(true);

      const bookingDate = new Date().toISOString().split('T')[0];
      
      const bookingData: CreateBookingRequest = {
        technicianId: technician._id,
        serviceId: service._id,
        addressId: address._id,
        timeSlotId: selectedSlot._id,
        date: bookingDate,
        totalAmount: calculatedTotalAmount,
        paymentMethod: selectedPaymentMethod
      };

      console.log('Confirming booking with:', bookingData);
      
      const response = await bookService(bookingData);
      
      if (response.success) {
        showToast({
          message: 'Booking confirmed successfully!',
          type: 'success',
          duration: 4000
        });
        

        navigate('/user/bookingsuccess', { 
          state: { 
            newBooking: response.data,
            message: 'Booking created successfully!'
          } 
        });
      } else {
        showToast({
          message: response.message || 'Failed to confirm booking',
          type: 'error'
        });
      }
      
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to confirm booking. Please try again.';
      showToast({
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsConfirmingBooking(false);
    }
  };

  const isBookingReady = selectedSlot && selectedPaymentMethod;

  return (
    <UserLayout>
      <Banner title="Booking Confirmation" height="400px" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Service Address
                </h2>
              </div>
              <AddressCard 
                address={address}
                showActions={false}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Selected Technician
                </h2>
              </div>
              <TechnicianCard 
                technician={technician}
                showBookButton={false}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Schedule Service
              </h2>
              
              {selectedSlot ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-medium text-green-900">
                          Time Slot Selected
                        </h3>
                      </div>
                      <p className="text-green-800">
                        {selectedSlot.date} at {selectedSlot.startTime} - {selectedSlot.endTime}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsSlotModalOpen(true)}
                      variant="outline"
                      className="text-sm"
                    >
                      Change Slot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select Time Slot
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Choose from available time slots from {technician.name}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={fetchTimeSlots}
                    disabled={isLoadingSlots}
                    isLoading={isLoadingSlots}
                    variant="primary"
                    className="px-8"
                  >
                    Select Time & Date
                  </Button>
                </div>
              )}
            </div>

            <PaymentMethodSelector
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              disabled={!selectedSlot}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              service={service}
              onConfirmBooking={handleConfirmBooking}
              isLoading={isConfirmingBooking}
              disabled={!isBookingReady}
              selectedPaymentMethod={selectedPaymentMethod}
              onTotalAmountChange={handleTotalAmountChange}
            />
          </div>
        </div>
      </div>

      <UserTimeSlotSelection
        isOpen={isSlotModalOpen}
        onClose={handleCloseSlotModal}
        timeSlots={timeSlots}
        technicianName={technician.name}
        onSelectSlot={handleSlotSelect}
        selectedSlot={selectedSlot}
      />
    </UserLayout>
  );
};