import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../../layouts/TechnicianLayout";
import { TechnicianProfileSidebar } from "../../../components/technician/TechnicianProfileSidebar";
import { TimeSlotDisplay } from "../../../components/technician/TimeSlotDisplay";
import MultiDatePicker from "../../../components/technician/MultiDatePicker";
import TimeSelection from "../../../components/technician/TimeSelection";
import Modal from "../../../components/common/Modal";
import { Plus, Clock } from "lucide-react";
import { TimeSlotData } from "../../../types/technicians.types";
import {
  createTimeSlots,
  getTimeSlots,
  blockTimeSlot,
} from "../../../services/technician.services";
import { ITimeSlot } from "../../../models/timeslot";
import { showToast } from "../../../utils/toast";

interface DateTimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export const TechnicianAvailability: React.FC = () => {
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedSlotForBlock, setSelectedSlotForBlock] = useState<{
    id: string;
    currentStatus: boolean;
    timeRange: string;
  } | null>(null);
  const [isBlockingSlot, setIsBlockingSlot] = useState(false);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const response = await getTimeSlots();
      if (response.success && response.data) {
        setTimeSlots(response.data);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      showToast({
        message: "Failed to load time slots. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBlockSlot = (slotId: string, currentStatus: boolean) => {
    const slot = timeSlots.find((s) => s._id === slotId);
    if (slot) {
      setSelectedSlotForBlock({
        id: slotId,
        currentStatus,
        timeRange: `${slot.startTime} - ${slot.endTime}`,
      });
      setShowBlockModal(true);
    }
  };

  const confirmBlockSlot = async () => {
    if (!selectedSlotForBlock) return;

    setIsBlockingSlot(true);
    try {
      const response = await blockTimeSlot(selectedSlotForBlock.id);

      if (response.success) {
        setTimeSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === selectedSlotForBlock.id
              ? { ...slot, isAvailable: !selectedSlotForBlock.currentStatus }
              : slot
          )
        );

        const action = selectedSlotForBlock.currentStatus
          ? "blocked"
          : "unblocked";
        showToast({
          message: `Time slot ${action} successfully!`,
          type: "success",
        });
      } else {
        showToast({
          message: response.message || "Failed to update time slot.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error blocking/unblocking slot:", error);
      showToast({
        message: "An error occurred while updating the time slot.",
        type: "error",
      });
    } finally {
      setIsBlockingSlot(false);
      setShowBlockModal(false);
      setSelectedSlotForBlock(null);
    }
  };

  const handleDatesChange = (dates: Date[]) => {
    console.log("Selected dates from MultiDatePicker:", dates);
    setSelectedDates(dates);
  };

  const handleTimeChange = (slots: DateTimeSlot[]) => {
    console.log("Time slots from TimeSelection:", slots);
    setDateTimeSlots(slots);
  };

  const createLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    const canSubmit = dateTimeSlots.every(
      (slot) => slot.startTime && slot.endTime
    );

    if (!canSubmit) {
      showToast({
        message: "Please configure time slots for all selected dates.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedSlots = dateTimeSlots.map((slot) => ({
        date: createLocalDateString(slot.date),
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      console.log("Data being sent to backend:", {
        dateTimeSlots: formattedSlots,
      });

      const timeSlotData: TimeSlotData = {
        dateTimeSlots: formattedSlots as any,
      };

      const response = await createTimeSlots(timeSlotData);

      if (response.success) {
        if (response.data && Array.isArray(response.data)) {
          setTimeSlots((prevSlots) => [...prevSlots, ...response.data]);
        } else {
          await fetchTimeSlots();
        }
        showToast({
          message: "Time slots created successfully!",
          type: "success",
        });
        setShowTimeSlotForm(false);
        setSelectedDates([]);
        setDateTimeSlots([]);
      } else {
        showToast({
          message: "Failed to create time slots. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating time slots:", error);
      showToast({
        message:
          "An error occurred while creating time slots. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowTimeSlotForm(false);
    setSelectedDates([]);
    setDateTimeSlots([]);
  };

  const canSubmit =
    selectedDates.length > 0 &&
    dateTimeSlots.every((slot) => slot.startTime && slot.endTime);

  return (
    <TechnicianLayout>
      <div className="flex h-full">
        <TechnicianProfileSidebar />
        <div className="flex-1 p-6">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Availability & Schedule
              </h1>
            </div>

            {showTimeSlotForm ? (
              <div className="space-y-6">
                <MultiDatePicker
                  onDatesChange={handleDatesChange}
                  maxDates={7}
                />

                <TimeSelection
                  selectedDates={selectedDates}
                  onTimeChange={handleTimeChange}
                  isLoading={isLoading}
                />

                {selectedDates.length > 0 && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || isLoading}
                      className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Creating..." : "Create Time Slots"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {timeSlots.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Your Schedule
                      </h2>
                      <button
                        onClick={() => setShowTimeSlotForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Slots
                      </button>
                    </div>

                    <TimeSlotDisplay
                      timeSlots={timeSlots}
                      onBlockSlot={handleBlockSlot}
                    />
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center py-12">
                      <div className="mb-6">
                        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      </div>
                      {isLoadingSlots ? (
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Loading your schedule...
                          </h2>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Manage Your Availability
                          </h2>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Create and manage your available time slots for
                            bookings. Set your working hours and preferred slot
                            durations.
                          </p>
                          <button
                            onClick={() => setShowTimeSlotForm(true)}
                            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Generate Time Slots
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={
          selectedSlotForBlock?.currentStatus
            ? "Block Time Slot"
            : "Unblock Time Slot"
        }
        confirmText={
          isBlockingSlot
            ? "Processing..."
            : selectedSlotForBlock?.currentStatus
              ? "Block Slot"
              : "Unblock Slot"
        }
        cancelText="Cancel"
        onConfirm={confirmBlockSlot}
        confirmButtonColor={
          selectedSlotForBlock?.currentStatus ? "red" : "green"
        }
      >
        <p>
          Are you sure you want to{" "}
          <strong>
            {selectedSlotForBlock?.currentStatus ? "block" : "unblock"}
          </strong>{" "}
          the time slot <strong>{selectedSlotForBlock?.timeRange}</strong>?
        </p>
        {selectedSlotForBlock?.currentStatus ? (
          <p className="mt-2 text-sm text-gray-600">
            This slot will no longer be available for customer bookings.
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            This slot will become available for customer bookings again.
          </p>
        )}
      </Modal>
    </TechnicianLayout>
  );
};
