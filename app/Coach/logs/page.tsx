"use client"
import { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { CoachSidebar } from '@/components/coachsidebar/coach-sidebar';
import { Coachmobilesidebar } from '@/components/coachsidebar/coachmobilesidebar';
import Swal from 'sweetalert2';

interface Session {
  session_id: number;
  application_id: number;
  session_date: string;
  user_weight: number | null;
  notes: string | null;
  created_at: string;
  user_name: string;
  package_title: string;
  training_status: string;
}

export default function CoachSessions() {
  const isMobile = useIsMobile();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editData, setEditData] = useState({
    user_weight: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/coach/my-sessions', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load sessions'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setEditData({
      user_weight: session.user_weight?.toString() || '',
      notes: session.notes || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingSession) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/training/update-session/${editingSession.session_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(editData)
        }
      );

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Session updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        setEditingSession(null);
        fetchSessions();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to update session'
        });
      }
    } catch (err) {
      console.error('Error updating session:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update session'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.package_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.training_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    const date = new Date(session.session_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

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
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
            <Coachmobilesidebar/>
          </header>
        )}

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Sessions Log</h1>
            <p className="text-gray-600">View and edit all your logged training sessions</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Client
                </label>
                <input
                  type="text"
                  placeholder="Search by client name or package..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="not_started">Not Started</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total Sessions: <span className="font-bold text-gray-900">{filteredSessions.length}</span>
              </p>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading sessions...</div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No sessions found' : 'No Sessions Logged Yet'}
              </h2>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start logging sessions with your clients!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                    <h2 className="text-xl font-bold text-white">{date}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {dateSessions.map((session) => (
                      <div key={session.session_id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{session.user_name}</h3>
                            <p className="text-sm text-gray-600">{session.package_title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(session.training_status)}`}>
                              {session.training_status.replace('_', ' ').toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleEdit(session)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-green-600 mb-1">CLIENT WEIGHT</p>
                            <p className="font-bold text-gray-900">
                              {session.user_weight ? `${session.user_weight} kg` : 'Not recorded'}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-purple-600 mb-1">LOGGED AT</p>
                            <p className="font-bold text-gray-900">
                              {new Date(session.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {session.notes && (
                          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-700 font-medium mb-1">SESSION NOTES</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingSession && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Session</h2>
                <button
                  onClick={() => setEditingSession(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Client</p>
                <p className="text-lg font-bold text-gray-900">{editingSession.user_name}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Session Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(editingSession.session_date).toLocaleDateString('en-US', {
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
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editData.user_weight}
                    onChange={(e) => setEditData(prev => ({ ...prev, user_weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter weight"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Notes
                  </label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What did you work on? Any achievements?"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Updating...' : 'Update Session'}
                </button>
                <button
                  onClick={() => setEditingSession(null)}
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