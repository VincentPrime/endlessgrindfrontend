"use client"
import { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CoachSidebar } from '@/components/coachsidebar/coach-sidebar';
import Swal from 'sweetalert2';
import { Coachmobilesidebar } from '@/components/coachsidebar/coachmobilesidebar';

interface Client {
  application_id: number;
  user_id: number;
  user_name: string;
  starting_weight: number;
  height: number;
  current_weight: number | null;
  training_status: string;
  package_title: string;
  coach_name: string;
  coach_availability: string;
  total_sessions: number;
  submitted_at: string;
}

interface Booking {
  booking_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  user_name: string;
  user_image?: string;
  package_title: string;
  weight?: number;
  height?: number;
}

export default function CoachClients() {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'clients' | 'schedule'>('clients');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sessionData, setSessionData] = useState({
    user_weight: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchBookings();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/coach/my-clients', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/coach-bookings', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return 'N/A';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const handleLogSession = (client: Client) => {
    setSelectedClient(client);
    setSessionData({
      user_weight: client.current_weight?.toString() || client.starting_weight?.toString() || '',
      notes: ''
    });
    setShowModal(true);
  };

  const submitSession = async () => {
    if (!selectedClient) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/training/log-session/${selectedClient.application_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(sessionData)
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Session logged successfully! ✅');
        setShowModal(false);
        fetchClients();
      } else {
        alert(data.message || 'Failed to log session');
      }
    } catch (err) {
      console.error('Error logging session:', err);
      alert('Failed to log session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteProgram = async (applicationId: number, clientName: string) => {
    const result = await Swal.fire({
      title: "Mark Program as Completed?",
      text: `Are you sure you want to mark ${clientName}'s training program as COMPLETED? This action cannot be undone.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as completed!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/training/complete/${applicationId}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Completed!",
          text: "Training program marked as completed successfully 🎉",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchClients();
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to complete program.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Error completing program:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while completing the program.",
        icon: "error",
      });
    }
  };

  const handleCompleteBooking = async (bookingId: number, userName: string) => {
    const result = await Swal.fire({
      title: "Mark Session as Completed?",
      text: `Complete the session with ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as completed!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/bookings/complete/${bookingId}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Completed!",
          text: "Session marked as completed",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchBookings();
      } else {
        Swal.fire("Error!", data.message || "Failed to complete session.", "error");
      }
    } catch (err) {
      console.error("Error completing session:", err);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      not_started: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.booking_date) >= new Date() && b.status === 'scheduled'
  );
  const todayBookings = upcomingBookings.filter(b => 
    b.booking_date === new Date().toISOString().split('T')[0]
  );

  return (
    <SidebarProvider>
      {!isMobile && <CoachSidebar />}
      <SidebarInset>
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
            <Coachmobilesidebar/>
          </header>
        )}

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Coach Dashboard</h1>
            <p className="text-gray-600">Manage your clients and scheduled sessions</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'clients'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Clients ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Schedule ({upcomingBookings.length})
              {todayBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {todayBookings.length} today
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : activeTab === 'clients' ? (
            // CLIENTS TAB
            clients.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Clients Yet</h2>
                <p className="text-gray-600">You don&apos;t have any assigned clients at the moment.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {clients.map((client) => {
                  const currentWeight = client.current_weight || client.starting_weight;
                  const bmi = calculateBMI(currentWeight, client.height);
                  const weightChange = client.current_weight 
                    ? client.current_weight - client.starting_weight 
                    : 0;

                  return (
                    <div key={client.application_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{client.user_name}</h3>
                          <p className="text-sm text-gray-600">{client.package_title}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(client.training_status)}`}>
                          {client.training_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-purple-600 mb-1">HEIGHT</p>
                          <p className="font-bold text-gray-900">{client.height ? `${client.height} cm` : 'N/A'}</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 mb-1">CURRENT WEIGHT</p>
                          <p className="font-bold text-gray-900">{currentWeight ? `${currentWeight} kg` : 'N/A'}</p>
                          {weightChange !== 0 && (
                            <p className={`text-xs font-medium ${weightChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                            </p>
                          )}
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-xs text-orange-600 mb-1">BMI</p>
                          <p className="font-bold text-gray-900">{bmi}</p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 mb-1">SESSIONS</p>
                          <p className="font-bold text-gray-900">{client.total_sessions}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t gap-2">
                        {client.training_status !== 'completed' && (
                          <>
                            <button
                              onClick={() => handleLogSession(client)}
                              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Log Session
                            </button>
                            <button
                              onClick={() => handleCompleteProgram(client.application_id, client.user_name)}
                              className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
                            >
                              Complete Program
                            </button>
                          </>
                        )}
                        {client.training_status === 'completed' && (
                          <span className="px-6 py-2 bg-gray-100 text-gray-600 font-medium rounded-md">
                            ✅ Program Completed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // SCHEDULE TAB
            upcomingBookings.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Scheduled Sessions</h2>
                <p className="text-gray-600">No upcoming sessions booked yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Today's Sessions */}
                {todayBookings.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Today&apos;s Sessions</h3>
                    <div className="space-y-4">
                      {todayBookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{booking.user_name}</h4>
                              <p className="text-blue-600 font-semibold">
                                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </p>
                              <p className="text-sm text-gray-600">{booking.package_title}</p>
                            </div>
                            <button
                              onClick={() => handleCompleteBooking(booking.booking_id, booking.user_name)}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                            >
                              Mark Complete
                            </button>
                          </div>
                          {booking.notes && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-gray-500">Notes:</p>
                              <p className="text-sm text-gray-700">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.booking_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-blue-600 font-semibold">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{booking.user_name}</p>
                            <p className="text-xs text-gray-500">{booking.package_title}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Log Session Modal */}
        {showModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Log Training Session</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Client</p>
                <p className="text-lg font-bold text-gray-900">{selectedClient.user_name}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sessionData.user_weight}
                    onChange={(e) => setSessionData(prev => ({ ...prev, user_weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter weight"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Notes (optional)
                  </label>
                  <textarea
                    value={sessionData.notes}
                    onChange={(e) => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What did you work on today? Any achievements?"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={submitSession}
                  disabled={submitting || !sessionData.user_weight}
                  className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Logging...' : 'Log Session'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}