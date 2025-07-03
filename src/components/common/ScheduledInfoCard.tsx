import React from "react";

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface ScheduleInfoCardProps {
  timeSlot?: TimeSlot;
  className?: string;
}

export const ScheduleInfoCard: React.FC<ScheduleInfoCardProps> = ({
  timeSlot,
  className = "",
}) => {
  const formatDate = (dateString: string) => {
    try {
      let date: Date;
      
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Error formatting date";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return "No time specified";
      
      if (/^\d{1,2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      if (timeString.includes('T') || timeString.includes(' ')) {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      
      return timeString;
    } catch (error) {
      return "Error formatting time";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Schedule Information
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Service Date
          </h3>
          <p className="text-lg text-gray-900 mt-1">
            {timeSlot ? formatDate(timeSlot.date) : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Time Slot
          </h3>
          <p className="text-lg text-gray-900 mt-1">
            {timeSlot 
              ? `${formatTime(timeSlot.startTime)} - ${formatTime(timeSlot.endTime)}`
              : "N/A"
            }
          </p>
        </div>
      </div>
    </div>
  );
};