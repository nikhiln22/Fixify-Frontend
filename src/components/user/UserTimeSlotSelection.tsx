import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { ITimeSlot } from "../../models/timeslot";
import Modal from "../common/Modal";

interface UserTimeSlotSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlots: ITimeSlot[];
  onSelectSlot: (slot: ITimeSlot | null) => void;
  selectedSlot?: ITimeSlot | null;
}

export const UserTimeSlotSelection: React.FC<UserTimeSlotSelectionProps> = ({
  isOpen,
  onClose,
  timeSlots,
  onSelectSlot,
  selectedSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot | null>(
    selectedSlot || null
  );
  const [groupedSlots, setGroupedSlots] = useState<{
    [key: string]: ITimeSlot[];
  }>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    setSelectedTimeSlot(selectedSlot || null);
  }, [selectedSlot]);

  useEffect(() => {
    const grouped: { [key: string]: ITimeSlot[] } = {};

    timeSlots.forEach((slot) => {
      if (!grouped[slot.date]) grouped[slot.date] = [];
      grouped[slot.date].push(slot);
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        const convertTo24Hour = (time: string): number => {
          const [timePart, period] = time.split(" ");
          const parts = timePart.split(":").map(Number);
          let hours = parts[0];
          const minutes = parts[1];

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          return hours * 60 + minutes;
        };

        return convertTo24Hour(a.startTime) - convertTo24Hour(b.startTime);
      });
    });

    setGroupedSlots(grouped);

    const dates = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("-").map(Number);
      const [dayB, monthB, yearB] = b.split("-").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });

    setAvailableDates(dates);
    if (!selectedDate && dates.length > 0) setSelectedDate(dates[0]);
  }, [timeSlots, selectedDate]);

  const selectedSlots = groupedSlots[selectedDate] || [];

  const handleSlotSelect = (slot: ITimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleConfirm = () => {
    onSelectSlot(selectedTimeSlot);
    onClose();
  };

  const formatDateDisplay = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: day,
      month: date.toLocaleDateString("en-US", { month: "short" }),
      weekday: dayName,
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Time & Date"
      confirmText={selectedTimeSlot ? "Confirm Slot" : undefined}
      cancelText="Cancel"
      onConfirm={selectedTimeSlot ? handleConfirm : undefined}
    >
      {timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Available Slots
          </h3>
          <p className="text-sm text-gray-600">
            This technician has no available time slots at the moment.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please try selecting a different technician.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Select Date
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {availableDates.map((date) => {
                const isSelected = selectedDate === date;
                const { day, month, weekday } = formatDateDisplay(date);
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTimeSlot(null);
                    }}
                    className={`flex-shrink-0 flex flex-col items-center justify-center px-5 py-4 rounded-xl border-2 min-w-[90px] transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md text-gray-700"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium mb-1 ${
                        isSelected ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {weekday}
                    </span>
                    <span className="text-2xl font-bold">{day}</span>
                    <span
                      className={`text-xs font-medium mt-1 ${
                        isSelected ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Available Time Slots
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-2 pt-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {selectedSlots.map((slot) => {
                const isSelected = selectedTimeSlot?._id === slot._id;
                return (
                  <button
                    key={slot._id}
                    onClick={() => handleSlotSelect(slot)}
                    className={`relative px-4 py-4 rounded-lg border-2 transition-all duration-200 text-center group ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-700"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="font-semibold text-sm">
                      {slot.startTime}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
