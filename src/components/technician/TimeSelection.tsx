import React, { useState, useEffect } from "react";
import SelectField from "../common/SelectField";

interface DateTimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

interface TimeSelectionProps {
  selectedDates: Date[];
  onTimeChange: (dateTimeSlots: DateTimeSlot[]) => void;
  isLoading?: boolean;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedDates,
  onTimeChange,
  isLoading = false,
}) => {
  const [dateTimeSlots, setDateTimeSlots] = useState<DateTimeSlot[]>([]);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newDateTimeSlots = selectedDates.map((date) => ({
      date,
      startTime: "",
      endTime: "",
    }));
    setDateTimeSlots(newDateTimeSlots);
    setTouched({});
    setErrors({});
  }, [selectedDates]);

  const generateStartTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 14; hour++) {
      const timeValue = `${hour.toString().padStart(2, "0")}:00`;
      const displayHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? "AM" : "PM";
      const timeLabel = `${displayHour}:00 ${ampm}`;
      times.push({ value: timeValue, label: timeLabel });
    }
    return times;
  };

  const generateEndTimeOptions = () => {
    const times = [];
    for (let hour = 14; hour <= 22; hour++) {
      const timeValue = `${hour.toString().padStart(2, "0")}:00`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = "PM";
      const timeLabel = `${displayHour}:00 ${ampm}`;
      times.push({ value: timeValue, label: timeLabel });
    }
    return times;
  };

  const formatDate = (date: Date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatTime12Hour = (time24: string) => {
    const [hour, minute] = time24.split(":");
    const hourNum = parseInt(hour);
    const displayHour =
      hourNum === 12 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = hourNum < 12 ? "AM" : "PM";
    return `${displayHour}:${minute} ${ampm}`;
  };

  const createLocalDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleTimeChange = (
    dateIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newDateTimeSlots = [...dateTimeSlots];
    newDateTimeSlots[dateIndex][field] = value;
    setDateTimeSlots(newDateTimeSlots);

    const fieldKey = `${dateIndex}-${field}`;
    if (errors[fieldKey]) {
      const newErrors = { ...errors };
      delete newErrors[fieldKey];
      setErrors(newErrors);
    }

    const fixedDateTimeSlots = newDateTimeSlots.map((slot) => ({
      ...slot,
      date: createLocalDate(slot.date),
    }));
    onTimeChange(fixedDateTimeSlots);
  };

  const handleBlur = (dateIndex: number, field: "startTime" | "endTime") => {
    const fieldKey = `${dateIndex}-${field}`;
    setTouched({ ...touched, [fieldKey]: true });

    const value = dateTimeSlots[dateIndex][field];
    if (!value) {
      setErrors({
        ...errors,
        [fieldKey]: `${field === "startTime" ? "Start" : "End"} time is required`,
      });
    }
  };

  const allSlotsConfigured = dateTimeSlots.every(
    (slot) => slot.startTime && slot.endTime
  );

  if (selectedDates.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          Please select dates first to configure time slots.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Set Your Working Hours
        </h2>
        <p className="text-gray-600 mb-3">
          Set your working hours for each selected date. Each date can have
          different start and end times.
        </p>
      </div>

      <div className="space-y-6">
        {dateTimeSlots.map((slot, index) => (
          <div
            key={slot.date.toDateString()}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {formatDate(slot.date)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Start Time"
                name={`startTime-${index}`}
                value={slot.startTime}
                onChange={(e) =>
                  handleTimeChange(index, "startTime", e.target.value)
                }
                onBlur={() => handleBlur(index, "startTime")}
                options={generateStartTimeOptions()}
                placeholder="Select start time"
                error={
                  touched[`${index}-startTime`] && errors[`${index}-startTime`]
                    ? errors[`${index}-startTime`]
                    : undefined
                }
                touched={touched[`${index}-startTime`]}
                disabled={isLoading}
              />

              <SelectField
                label="End Time"
                name={`endTime-${index}`}
                value={slot.endTime}
                onChange={(e) =>
                  handleTimeChange(index, "endTime", e.target.value)
                }
                onBlur={() => handleBlur(index, "endTime")}
                options={generateEndTimeOptions()}
                placeholder="Select end time"
                error={
                  touched[`${index}-endTime`] && errors[`${index}-endTime`]
                    ? errors[`${index}-endTime`]
                    : undefined
                }
                touched={touched[`${index}-endTime`]}
                disabled={isLoading}
              />
            </div>
          </div>
        ))}
      </div>

      {allSlotsConfigured && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Selected Schedule:</h4>
          <div className="space-y-2">
            {dateTimeSlots.map((slot, index) => (
              <div
                key={index}
                className="text-sm text-gray-800 flex items-center"
              >
                <span className="text-gray-600 mr-2">✓</span>
                <span>
                  <strong>{formatDate(slot.date)}</strong> -{" "}
                  {formatTime12Hour(slot.startTime)} to{" "}
                  {formatTime12Hour(slot.endTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
