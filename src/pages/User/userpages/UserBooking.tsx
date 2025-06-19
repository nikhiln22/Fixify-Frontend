import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import UserLayout from "../../../layouts/UserLayout";
import Banner from "../../../components/common/Banner";
import { AddressCard } from "../../../components/user/AddressCard";
import TechnicianCard from "../../../components/user/TechncianCard";
import { UserTimeSlotSelection } from "../../../components/user/UserTimeSlotSelection";
import { BookingSummary } from "../../../components/user/BookingSummary";
import {
  PaymentMethodSelector,
  PaymentMethod,
} from "../../../components/user/PaymentMethodSelector";
import Button from "../../../components/common/Button";
import { getTimeSlots, bookService } from "../../../services/user.services";
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const state = location.state;
  const { service, address, technician } = state;

  const fetchTimeSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const response = await getTimeSlots(technician.id, false);

      if (response.success) {
        setTimeSlots(response.data || []);
        setIsSlotModalOpen(true);
      } else {
        showToast({
          message: "Failed to fetch available time slots",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        message: "Failed to fetch available time slots. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
  };

  const handleCloseSlotModal = () => {
    setIsSlotModalOpen(false);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      showToast({
        message: "Please select a time slot first",
        type: "warning",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      showToast({
        message: "Please select a payment method",
        type: "warning",
      });
      return;
    }

    try {
      setIsConfirmingBooking(true);

      const bookingData: CreateBookingRequest = {
        technicianId: technician._id,
        serviceId: service._id,
        addressId: address._id,
        timeSlotId: selectedSlot._id,
        totalAmount: service.price,
        paymentMethod: selectedPaymentMethod,
      };

      const response = await bookService(bookingData);

      if (response.success && response.data) {
        if (response.data.requiresPayment && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          showToast({
            message: "Booking confirmed successfully!",
            type: "success",
          });

          navigate("/user/bookingsuccess", {
            state: {
              booking: response.data,
              paymentMethod: selectedPaymentMethod,
            },
          });
        }
      } else {
        showToast({
          message: response.message || "Failed to confirm booking",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        message: "Failed to confirm booking. Please try again.",
        type: "error",
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Service Address
              </h2>
              <AddressCard address={address} showActions={false} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Selected Technician
              </h2>
              <TechnicianCard technician={technician} showBookButton={false} />
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
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-green-900">
                          Time Slot Selected
                        </h3>
                      </div>
                      <p className="text-green-800">
                        {selectedSlot.date} at {selectedSlot.startTime} -{" "}
                        {selectedSlot.endTime}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Time Slot
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose from available time slots from {technician.name}
                  </p>
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
