"use client"
import { useState, useEffect } from 'react';

interface BookedSlot {
  booking_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  user_name?: string;
  package_title?: string;
}

interface Coach {
  coach_id: number;
  coach_name: string;
  availability: string;
}

interface BookingCalendarProps {
  applicationId: number;
  coachId: number;
  onBookingSuccess?: () => void;
}

export function BookingCalendar({ applicationId, coachId, onBookingSuccess }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [coach, setCoach] = useState<Coach | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Generate time slots from 10:00 AM to 7:00 PM (1-hour intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 19; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
      const displayStart = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
      const displayEnd = (hour + 1) < 12 ? `${hour + 1}:00 AM` : (hour + 1) === 12 ? '12:00 PM' : `${hour + 1 - 12}:00 PM`;
      
      slots.push({
        value: startTime,
        endTime: endTime,
        display: `${displayStart} - ${displayEnd}`
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/bookings/coach-availability/${coachId}?date=${selectedDate}`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setCoach(data.coach);
        setBookedSlots(data.booked_slots || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSlotBooked = (timeSlot: string) => {
    return bookedSlots.some(slot => slot.start_time === timeSlot);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select a date and time slot');
      return;
    }

    setSubmitting(true);

    try {
      const slot = timeSlots.find(s => s.value === selectedTimeSlot);
      
      const response = await fetch('/api/bookings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          application_id: applicationId,
          coach_id: coachId,
          booking_date: selectedDate,
          start_time: selectedTimeSlot,
          end_time: slot?.endTime
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Time slot booked successfully!');
        setSelectedTimeSlot('');
        fetchAvailability(); // Refresh availability
        if (onBookingSuccess) onBookingSuccess();
      } else {
        alert(data.message || 'Failed to book time slot');
      }
    } catch (error) {
      console.error('Error booking time slot:', error);
      alert('Failed to book time slot');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Parse coach availability to show which days are available
  const parseAvailability = (availability: string) => {
    if (!availability) return 'Monday to Saturday, 10:00 AM - 7:00 PM';
    return availability;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Training Session</h2>
      
      {coach && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">COACH AVAILABILITY</p>
          <p className="text-lg font-bold text-gray-900">{coach.coach_name}</p>
          <p className="text-sm text-gray-600">{parseAvailability(coach.availability)}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTimeSlot('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Available Monday to Saturday only
          </p>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Time Slot
            </label>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading available slots...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isBooked = isSlotBooked(slot.value);
                  const isSelected = selectedTimeSlot === slot.value;
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => !isBooked && setSelectedTimeSlot(slot.value)}
                      disabled={isBooked}
                      className={`
                        p-3 rounded-lg border-2 font-medium transition-all
                        ${isBooked 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                        }
                      `}
                    >
                      <div className="text-sm">{slot.display}</div>
                      {isBooked && (
                        <div className="text-xs mt-1">Already Booked</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedDate && bookedSlots.length === 0 && !loading && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-700 font-medium">All slots available for this date!</p>
              </div>
            )}
          </div>
        )}

        {/* Book Button */}
        {selectedTimeSlot && (
          <button
            onClick={handleBooking}
            disabled={submitting}
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}