"use client"
import { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { CoachSidebar } from '@/components/coachsidebar/coach-sidebar';
import Swal from 'sweetalert2';

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

export default function CoachClients() {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sessionData, setSessionData] = useState({
    user_weight: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/coach/my-clients', {
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
        `http://localhost:4000/api/training/log-session/${selectedClient.application_id}`,
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
        fetchClients(); // Refresh the list
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
    confirmButtonColor: "#28a745", // green for "complete"
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, mark as completed!",
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`http://localhost:4000/api/training/complete/${applicationId}`, {
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      not_started: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <SidebarProvider>
               {!isMobile && <CoachSidebar />}
      <SidebarInset>
               {isMobile &&  
               <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-11 py-2">
                   <div className="flex items-center gap-2 ">
                   <div className="relative h-20 w-20 overflow-hidden rounded-full">
                   <Image
                   src={"/icon.png"}
                   alt=""
                   fill
                   className="object-cover"
                   />
                   </div>
                   <div className="flex flex-col font-semibold">
                   <h1 className="text-2xl">Endless Grind</h1>
                   </div>
                   </div>
               </header> 
               }

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Clients</h1>
            <p className="text-gray-600">Manage your training sessions and track client progress</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading clients...</div>
            </div>
          ) : clients.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Clients Yet</h2>
              <p className="text-gray-600">You don't have any assigned clients at the moment.</p>
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
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 mb-1">COACH</p>
                        <p className="font-bold text-gray-900">{client.coach_name}</p>
                      </div>

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
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Sessions Completed</p>
                        <p className="text-2xl font-bold text-blue-600">{client.total_sessions}</p>
                      </div>

                      <div className="flex gap-2">
                        {client.training_status !== 'completed' && (
                          <>
                            <button
                              onClick={() => handleLogSession(client)}
                              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Logs
                            </button>
                            <button
                              onClick={() => handleCompleteProgram(client.application_id, client.user_name)}
                              className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
                            >
                              Completed
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
                  </div>
                );
              })}
            </div>
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