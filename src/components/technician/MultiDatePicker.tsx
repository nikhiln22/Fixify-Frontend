import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../assets/multi-date-picker.css'; 

interface MultiDatePickerProps {
  onDatesChange: (dates: Date[]) => void;
  maxDates?: number;
  className?: string;
}

const MultiDatePicker: React.FC<MultiDatePickerProps> = ({
  onDatesChange,
  maxDates = 7,
  className = ''
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const minDate = getTomorrowDate();

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    
    if (date.getDay() === 0) return true;
    
    if (date < minDate) return true;
    
    return false;
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toDateString();
    
    const isSelected = selectedDates.some(selectedDate => 
      selectedDate.toDateString() === dateString
    );

    let newSelectedDates: Date[];

    if (isSelected) {
      newSelectedDates = selectedDates.filter(selectedDate => 
        selectedDate.toDateString() !== dateString
      );
    } else {
      if (selectedDates.length < maxDates) {
        newSelectedDates = [...selectedDates, date].sort((a, b) => a.getTime() - b.getTime());
      } else {
        return;
      }
    }

    setSelectedDates(newSelectedDates);
    onDatesChange(newSelectedDates);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isDateSelected(date)) {
      return <div className="selected-date-indicator"></div>;
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const classes = [];
    
    if (isDateSelected(date)) {
      classes.push('selected-date');
    }
    
    if (date.getDay() === 0) {
      classes.push('sunday-disabled');
    }
    
    return classes.join(' ');
  };

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return [];
    
    return selectedDates.map(date => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return {
        date: date,
        formatted: `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
      };
    });
  };

  return (
    <div className={`multi-date-picker ${className}`}>
      <div className="mb-4">
        <p className="text-sm text-gray-500 mt-1">
          Click on dates to select them. Sundays are not available.
        </p>
      </div>

      <Calendar
        onClickDay={handleDateClick}
        tileDisabled={isDateDisabled}
        tileClassName={tileClassName}
        tileContent={tileContent}
        showNeighboringMonth={false}
        minDate={minDate}
        selectRange={false}
        value={null}
      />

      {selectedDates.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Dates:</h4>
          <div className="flex flex-wrap gap-2">
            {formatSelectedDates().map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {item.formatted}
                <button
                  type="button"
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none"
                  onClick={() => handleDateClick(item.date)}
                >
                  <span className="sr-only">Remove date</span>
                  <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedDates.length >= maxDates && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Maximum limit reached:</strong> You can select up to {maxDates} dates only.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiDatePicker;