"use client"
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Booking {
  booking_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  coach_name: string;
  specialty: string;
  package_title: string;
}

export function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/my-bookings', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number, date: string, time: string) => {
    const result = await Swal.fire({
      title: 'Cancel Booking?',
      text: `Are you sure you want to cancel your booking on ${new Date(date).toLocaleDateString()} at ${formatTime(time)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: 'Cancelled!',
          text: 'Your booking has been cancelled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        fetchBookings();
      } else {
        Swal.fire('Error', data.message || 'Failed to cancel booking', 'error');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Swal.fire('Error', 'Failed to cancel booking', 'error');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const isUpcoming = (date: string) => {
    return new Date(date) >= new Date();
  };

  const upcomingBookings = bookings.filter(b => isUpcoming(b.booking_date) && b.status === 'scheduled');
  const pastBookings = bookings.filter(b => !isUpcoming(b.booking_date) || b.status !== 'scheduled');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
        
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>No upcoming sessions scheduled</p>
            <p className="text-sm mt-1">Book a session with your coach!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.booking_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg text-gray-900">
                      {new Date(booking.booking_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">COACH</p>
                    <p className="font-semibold text-gray-900">{booking.coach_name}</p>
                    <p className="text-xs text-gray-500">{booking.specialty}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">PACKAGE</p>
                    <p className="font-semibold text-gray-900">{booking.package_title}</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Notes:</p>
                    <p className="text-sm text-gray-700">{booking.notes}</p>
                  </div>
                )}

                {booking.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancelBooking(booking.booking_id, booking.booking_date, booking.start_time)}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Past Sessions</h2>
          
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <div key={booking.booking_id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)} • {booking.coach_name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
