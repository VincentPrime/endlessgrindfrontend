"use client"
import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/adminsidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Adminmobilesidebar } from '@/components/adminsidebar/adminmobilesidebar';

interface Schedule {
  application_id: number;
  user_id: number;
  user_name: string;
  training_status: string;
  submitted_at: string;
  package_title: string;
  coach_name: string;
  total_sessions: number;
  last_session_date: string | null;
}

interface Session {
  session_id: number;
  session_date: string;
  user_weight: number;
  notes: string;
  coach_name: string;
  user_name: string;
}

export default function AdminSchedule() {
  const isMobile = useIsMobile();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'not_started' | 'ongoing' | 'completed'>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/all-schedules', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionHistory = async (applicationId: number) => {
    setLoadingSessions(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/training/sessions/${applicationId}`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    fetchSessionHistory(schedule.application_id);
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') return true;
    return schedule.training_status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      not_started: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      not_started: 'Not Started',
      ongoing: 'Ongoing',
      completed: 'Completed'
    };
    return texts[status] || status;
  };

  const stats = {
    total: schedules.length,
    not_started: schedules.filter(s => s.training_status === 'not_started').length,
    ongoing: schedules.filter(s => s.training_status === 'ongoing').length,
    completed: schedules.filter(s => s.training_status === 'completed').length
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      <SidebarInset>
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
            <Adminmobilesidebar/>
          </header>
          )}

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Schedules</h1>
            <p className="text-gray-600">Monitor all ongoing and completed training programs</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Total Programs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4">
              <p className="text-sm text-blue-600 mb-1">Not Started</p>
              <p className="text-3xl font-bold text-blue-700">{stats.not_started}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <p className="text-sm text-green-600 mb-1">Ongoing</p>
              <p className="text-3xl font-bold text-green-700">{stats.ongoing}</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-700">{stats.completed}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {(['all', 'not_started', 'ongoing', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'all' ? 'All' : getStatusText(tab)} ({
                  tab === 'all' ? stats.total :
                  tab === 'not_started' ? stats.not_started :
                  tab === 'ongoing' ? stats.ongoing :
                  stats.completed
                })
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading schedules...</div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Schedules Found</h2>
              <p className="text-gray-600">No training programs match the selected filter.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.application_id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{schedule.user_name}</h3>
                      <p className="text-sm text-gray-600">{schedule.package_title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(schedule.training_status)}`}>
                      {getStatusText(schedule.training_status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Coach</p>
                      <p className="font-semibold text-gray-900">{schedule.coach_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sessions</p>
                      <p className="font-semibold text-gray-900">{schedule.total_sessions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Started</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(schedule.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Session</p>
                      <p className="font-semibold text-gray-900">
                        {schedule.last_session_date 
                          ? new Date(schedule.last_session_date).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(schedule)}
                    className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                  >
                    View Session History
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session History Modal */}
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSchedule.user_name}</h2>
                  <p className="text-gray-600">{selectedSchedule.package_title} - {selectedSchedule.coach_name}</p>
                </div>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-600 mb-1">TOTAL SESSIONS</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedSchedule.total_sessions}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-green-600 mb-1">STATUS</p>
                    <p className="text-lg font-bold text-gray-900">{getStatusText(selectedSchedule.training_status)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-600 mb-1">COACH</p>
                    <p className="text-lg font-bold text-gray-900">{selectedSchedule.coach_name}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Session History</h3>

              {loadingSessions ? (
                <div className="text-center py-8 text-gray-500">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <p>No sessions logged yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div key={session.session_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            Session #{sessions.length - index}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.session_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {session.user_weight && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-2xl font-bold text-green-600">{session.user_weight} kg</p>
                          </div>
                        )}
                      </div>
                      
                      {session.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Coach Notes:</p>
                          <p className="text-sm text-gray-700">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}