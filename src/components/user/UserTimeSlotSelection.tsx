import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { ITimeSlot } from "../../models/timeslot";
import Modal from "../common/Modal";

interface UserTimeSlotSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  timeSlots: ITimeSlot[];
  technicianName: string;
  onSelectSlot: (slot: ITimeSlot) => void;
  selectedSlot?: ITimeSlot | null;
}

const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return {
    dayName: days[date.getDay()],
    dayNumber: day,
    monthName: months[date.getMonth()],
    fullDate: dateStr,
    displayDate: `${days[date.getDay()]}, ${months[date.getMonth()]} ${day}`
  };
};

const groupSlotsByDate = (slots: ITimeSlot[]) => {
  const grouped: { [key: string]: ITimeSlot[] } = {};

  slots.forEach((slot) => {
    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }
    grouped[slot.date].push(slot);
  });

  // Sort slots within each date by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      const timeA = convertTo24Hour(a.startTime);
      const timeB = convertTo24Hour(b.startTime);
      return timeA.localeCompare(timeB);
    });
  });

  return grouped;
};

const convertTo24Hour = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return `${hours.padStart(2, "0")}:${minutes}`;
};

export const UserTimeSlotSelection: React.FC<UserTimeSlotSelectionProps> = ({
  isOpen,
  onClose,
  timeSlots,
  technicianName,
  onSelectSlot,
  selectedSlot
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot | null>(selectedSlot || null);
  const [groupedSlots, setGroupedSlots] = useState<{ [key: string]: ITimeSlot[] }>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const grouped = groupSlotsByDate(timeSlots);
    setGroupedSlots(grouped);

    const datesWithSlots = Object.keys(grouped).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("-");
      const [dayB, monthB, yearB] = b.split("-");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    setAvailableDates(datesWithSlots);

    if (datesWithSlots.length > 0 && !selectedDate) {
      setSelectedDate(datesWithSlots[0]);
    }
  }, [timeSlots, selectedDate]);

  const selectedSlots = groupedSlots[selectedDate] || [];

  const handleSlotSelect = (slot: ITimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      onSelectSlot(selectedTimeSlot);
      onClose();
    }
  };

  const modalContent = (
    <div className="text-left max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Select Time & Date
        </h3>
        <p className="text-sm text-gray-600">
          Choose from available time slots with {technicianName}
        </p>
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No slots available
          </h3>
          <p className="text-gray-600">
            {technicianName} doesn't have any available slots at the moment.
          </p>
        </div>
      ) : (
        <>
          {/* Date Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select Date</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {availableDates.map((date) => {
                const formattedDate = formatDate(date);
                const isSelected = selectedDate === date;
                const slotsCount = groupedSlots[date]?.length || 0;

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTimeSlot(null); // Reset selected slot when changing date
                    }}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg border transition-all min-w-[80px] ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {formattedDate.dayName}
                    </span>
                    <span className="text-lg font-semibold">
                      {formattedDate.dayNumber}
                    </span>
                    <span className="text-xs">{formattedDate.monthName}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {slotsCount} slots
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Available times for {formatDate(selectedDate).displayDate}
              </h4>
              
              {selectedSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No slots available for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {selectedSlots.map((slot) => {
                    const isSelected = selectedTimeSlot?._id === slot._id;
                    
                    return (
                      <button
                        key={slot._id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`relative px-4 py-3 rounded-lg border-2 transition-all text-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          {isSelected && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div className="font-medium text-sm">
                          {slot.startTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {slot.endTime}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected Slot Display */}
          {selectedTimeSlot && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Selected Slot</span>
              </div>
              <p className="text-sm text-blue-800">
                {formatDate(selectedTimeSlot.date).displayDate} at {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-2xl"
      confirmText={selectedTimeSlot ? "Confirm Slot" : undefined}
      cancelText="Cancel"
      onConfirm={selectedTimeSlot ? handleConfirm : undefined}
    >
      {modalContent}
    </Modal>
  );
};