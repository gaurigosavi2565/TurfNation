import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { formatTime } from '../lib/format';
import type { TurfAvailability } from '../lib/supabaseClient';

interface SlotPickerProps {
  availability: TurfAvailability[];
  selectedSport: string;
  onSlotSelect: (date: Date, startTime: string, endTime: string, hours: number) => void;
  className?: string;
}

const SlotPicker: React.FC<SlotPickerProps> = ({ 
  availability, 
  selectedSport, 
  onSlotSelect,
  className = ""
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedHours, setSelectedHours] = useState<number>(1);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Get availability for selected date and sport
  const dayOfWeek = selectedDate.getDay();
  const availableSlots = availability.filter(
    slot => slot.sport_id === selectedSport && slot.weekday === dayOfWeek
  );

  // Generate time slots
  const generateTimeSlots = (startTime: string, endTime: string, slotMinutes: number = 60) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMin += slotMinutes;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }
    
    return slots;
  };

  const allTimeSlots = availableSlots.flatMap(slot => 
    generateTimeSlots(slot.start_time, slot.end_time, slot.slot_minutes || 60)
  );

  const handleSlotSelection = (timeSlot: string) => {
    setSelectedSlot(timeSlot);
    
    // Calculate end time based on selected hours
    const [hour, min] = timeSlot.split(':').map(Number);
    const endHour = hour + selectedHours;
    const endTime = `${endHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    onSlotSelect(selectedDate, timeSlot, endTime, selectedHours);
  };

  useEffect(() => {
    setSelectedSlot('');
  }, [selectedDate, selectedSport]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-800 mb-3 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Select Date</span>
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(startOfDay(date))}
              className={`p-3 text-center rounded-lg border transition-colors ${
                selectedDate.toDateString() === date.toDateString()
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-xs font-medium">
                {format(date, 'EEE')}
              </div>
              <div className="text-sm font-semibold">
                {format(date, 'd')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hours Selection */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-800 mb-3">Duration</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((hours) => (
            <button
              key={hours}
              onClick={() => setSelectedHours(hours)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedHours === hours
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {hours} hour{hours > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-800 mb-3 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Available Time Slots</span>
        </h3>
        {allTimeSlots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {allTimeSlots.map((timeSlot) => (
              <button
                key={timeSlot}
                onClick={() => handleSlotSelection(timeSlot)}
                className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                  selectedSlot === timeSlot
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {formatTime(timeSlot)}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No available slots for this date and sport.</p>
            <p className="text-sm">Please select a different date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPicker;