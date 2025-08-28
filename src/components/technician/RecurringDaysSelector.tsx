import React from "react";

interface RecurringDaysSelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
  showError?: boolean;
}

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

export const RecurringDaysSelector: React.FC<RecurringDaysSelectorProps> = ({
  selectedDays,
  onDaysChange,
  showError = false,
}) => {
  const handleDayToggle = (dayValue: string) => {
    if (selectedDays.includes(dayValue)) {
      onDaysChange(selectedDays.filter((d) => d !== dayValue));
    } else {
      onDaysChange([...selectedDays, dayValue]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Working Days
      </label>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => (
          <label
            key={day.value}
            className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedDays.includes(day.value)
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={selectedDays.includes(day.value)}
              onChange={() => handleDayToggle(day.value)}
            />
            <span className="text-sm font-medium">{day.label}</span>
          </label>
        ))}
      </div>

      {showError && selectedDays.length === 0 && (
        <p className="text-red-500 text-sm mt-2">
          Please select at least one working day
        </p>
      )}

      {selectedDays.length > 0 && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            Selected days:{" "}
            <span className="font-medium">{selectedDays.join(", ")}</span>
          </p>
        </div>
      )}
    </div>
  );
};
