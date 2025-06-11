import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import { ITimeSlot } from "../../models/timeslot";
import { TimeSlotDisplayProps } from "../../types/component.types";

const formatDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    dayName: days[date.getDay()],
    dayNumber: day,
    monthName: months[date.getMonth()],
    fullDate: dateStr,
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

export const TimeSlotDisplay: React.FC<TimeSlotDisplayProps & {
  onBlockSlot: (slotId: string, currentStatus: boolean) => void;
}> = ({
  timeSlots,
  onBlockSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [groupedSlots, setGroupedSlots] = useState<{
    [key: string]: ITimeSlot[];
  }>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const grouped = groupSlotsByDate(timeSlots);
    setGroupedSlots(grouped);

    const datesWithSlots = Object.keys(grouped);
    setAvailableDates(datesWithSlots);

    if (datesWithSlots.length > 0 && !selectedDate) {
      setSelectedDate(datesWithSlots[0]);
    }
  }, [timeSlots, selectedDate]);

  const selectedSlots = groupedSlots[selectedDate] || [];

  const totalSlots = selectedSlots.length;
  const bookedSlots = selectedSlots.filter((slot) => slot.isBooked).length;
  const blockedSlots = selectedSlots.filter((slot) => !slot.isAvailable && !slot.isBooked).length;
  const availableSlots = totalSlots - bookedSlots - blockedSlots;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-black" />
          <h2 className="text-xl font-semibold text-gray-900">
            Your Time Slots
          </h2>
        </div>

        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{availableSlots} Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">{bookedSlots} Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">{blockedSlots} Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Total: {totalSlots} slots</span>
          </div>
        </div>
      </div>

      {availableDates.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-3 overflow-x-auto">
            {availableDates.map((date) => {
              const formattedDate = formatDate(date);
              const isSelected = selectedDate === date;
              const hasSlots = groupedSlots[date]?.length > 0;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 flex flex-col items-center px-6 py-2 rounded-lg border transition-all min-w-[80px] ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : hasSlots
                        ? "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {formattedDate.dayName}
                  </span>
                  <span className="text-lg font-semibold">
                    {formattedDate.dayNumber}
                  </span>
                  <span className="text-sm">{formattedDate.monthName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-6">
        {availableDates.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No slots available
            </h3>
            <p className="text-gray-600">
              You haven't created any time slots yet. Click "Add More Slots" to
              get started.
            </p>
          </div>
        ) : selectedSlots.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No slots available
            </h3>
            <p className="text-gray-600">
              {selectedDate
                ? `No time slots found for ${formatDate(selectedDate).dayName}, ${formatDate(selectedDate).monthName} ${formatDate(selectedDate).dayNumber}`
                : "Select a date to view available slots"}
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Available times for {formatDate(selectedDate).dayName},{" "}
              {formatDate(selectedDate).monthName}{" "}
              {formatDate(selectedDate).dayNumber}
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {selectedSlots.map((slot) => {
                const isBlocked = !slot.isAvailable && !slot.isBooked;
                const isBooked = slot.isBooked;

                return (
                  <div
                    key={slot._id}
                    className={`relative px-4 py-3 rounded-lg border-2 transition-all text-center group ${
                      isBooked
                        ? "border-red-200 bg-red-50 text-red-400"
                        : isBlocked
                        ? "border-orange-200 bg-orange-50 text-orange-400"
                        : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      {isBooked ? (
                        <XCircle className="w-4 h-4" />
                      ) : isBlocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="font-medium text-sm">
                      {slot.startTime} - {slot.endTime}
                    </div>

                    {isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        <span className="text-xs font-medium text-red-700 bg-red-200 px-2 py-1 rounded">
                          BOOKED
                        </span>
                      </div>
                    )}

                    {isBlocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded">
                          BLOCKED
                        </span>
                      </div>
                    )}

                    {!isBooked && (
                      <button
                        onClick={() => onBlockSlot(slot._id, slot.isAvailable ?? true)}
                        className={`absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                          isBlocked
                            ? "bg-green-100 hover:bg-green-200 text-green-600"
                            : "bg-orange-100 hover:bg-orange-200 text-orange-600"
                        }`}
                        title={isBlocked ? "Unblock slot" : "Block slot"}
                      >
                        {isBlocked ? (
                          <Unlock className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {timeSlots.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Gray slots are available for booking. Red
            slots are already booked by customers. Orange slots are blocked by you.
            Hover over slots to block/unblock them.
          </p>
        </div>
      )}
    </div>
  );
};