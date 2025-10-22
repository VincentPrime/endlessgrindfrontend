"use client"
import { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/userssidebar/user-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

interface Schedule {
  application_id: number;
  user_name: string;
  training_status: string;
  submitted_at: string;
  package_title: string;
  package_description: string;
  coach_name: string;
  coach_availability: string;
  total_sessions: number;
}

interface Session {
  session_id: number;
  session_date: string;
  user_weight: number;
  notes: string;
  coach_name: string;
}

export default function MySchedule() {
  const isMobile = useIsMobile();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/my-schedule', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSchedule(data.schedule);
        setSessions(data.sessions || []);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to load schedule');
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

  return (
    <SidebarProvider>
      {!isMobile && <UserSidebar />}
      <SidebarInset>
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-11 py-2">
            <div className="flex items-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image src="/icon.png" alt="" fill className="object-cover" />
              </div>
              <div className="flex flex-col font-semibold">
                <h1 className="text-2xl">Endless Grind</h1>
              </div>
            </div>
          </header>
        )}

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Training Schedule</h1>
            <p className="text-gray-600">View your current training program and session history</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading your schedule...</div>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Training Program</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Apply for a membership to start your fitness journey!
              </p>
            </div>
          ) : schedule ? (
            <div className="space-y-6">
              {/* Current Program Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{schedule.package_title}</h2>
                    <p className="text-sm text-gray-600">{schedule.package_description}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(schedule.training_status)}`}>
                    {getStatusText(schedule.training_status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">YOUR NAME</p>
                    <p className="text-lg font-bold text-gray-900">{schedule.user_name}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-green-600 font-medium mb-1">YOUR COACH</p>
                    <p className="text-lg font-bold text-gray-900">{schedule.coach_name}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-600 font-medium mb-1">COACH AVAILABILITY</p>
                    <p className="text-lg font-bold text-gray-900">{schedule.coach_availability || 'Check with coach'}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions Completed</p>
                      <p className="text-3xl font-bold text-blue-600">{schedule.total_sessions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Started On</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(schedule.submitted_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session History */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Session History</h3>
                
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📅</div>
                    <p>No sessions logged yet. Your coach will log sessions after each training day.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session, index) => (
                      <div key={session.session_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                              <p className="text-xs text-gray-500">Weight Recorded</p>
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

              {/* Weight Progress Chart (if sessions exist) */}
              {sessions.length > 0 && sessions.some(s => s.user_weight) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Weight Progress</h3>
                  <div className="space-y-2">
                    {sessions.filter(s => s.user_weight).reverse().map((session, index, arr) => {
                      const weightChange = index > 0 ? session.user_weight - arr[index - 1].user_weight : 0;
                      return (
                        <div key={session.session_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(session.session_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-bold text-gray-900">{session.user_weight} kg</p>
                            {weightChange !== 0 && (
                              <span className={`text-sm font-medium px-2 py-1 rounded ${
                                weightChange < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}