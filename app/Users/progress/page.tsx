"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/userssidebar/user-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Usermobilesidebar } from '@/components/userssidebar/usermobilesidebar';

interface ProgressData {
  initial: {
    weight: number;
    height: number;
    bmi: number;
    date: string;
  };
  sessions: Array<{
    date: string;
    weight: number;
    notes?: string;
  }>;
}

export default function Progress() {
  const isMobile = useIsMobile();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await fetch("/api/user/progress", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        if (data.hasData) {
          setProgressData({
            initial: data.initial,
            sessions: data.sessions
          });
        } else {
          setError(data.message || "No progress data available");
        }
      } else {
        setError(data.message || "Failed to fetch progress data");
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateWeightChange = () => {
    if (!progressData || progressData.sessions.length === 0) return 0;
    const latestWeight = progressData.sessions[progressData.sessions.length - 1].weight;
    return latestWeight - progressData.initial.weight;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600 bg-blue-50" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600 bg-green-50" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Obese", color: "text-red-600 bg-red-50" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-2xl font-semibold text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <Card className="p-12 text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Progress Data</h2>
          <p className="text-gray-600 mb-4">
            {error || "You haven't started tracking your progress yet."}
          </p>
          <p className="text-sm text-gray-500">
            Make sure you've entered your weight and height in your profile, and have an active training program.
          </p>
        </Card>
      </div>
    );
  }

  const currentWeight = progressData.sessions.length > 0
    ? progressData.sessions[progressData.sessions.length - 1].weight
    : progressData.initial.weight;

  const currentBMI = parseFloat(calculateBMI(currentWeight, progressData.initial.height));
  const initialBMI = progressData.initial.bmi;
  const weightChange = calculateWeightChange();
  const bmiCategory = getBMICategory(currentBMI);

  // Prepare chart data
  const chartData = [
    {
      date: new Date(progressData.initial.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: progressData.initial.weight,
      bmi: initialBMI,
    },
    ...progressData.sessions.map((session) => ({
      date: new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: session.weight,
      bmi: parseFloat(calculateBMI(session.weight, progressData.initial.height)),
    })),
  ];

  return (
    <SidebarProvider>
        {!isMobile && <UserSidebar />}
        <SidebarInset>
            {isMobile && (
                <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
                    <Usermobilesidebar/>
                </header>
            )}

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">My Progress</h1>
                <p className="text-gray-600 text-lg">Track your fitness journey and achievements</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Current Weight */}
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <p className="text-blue-100 text-sm font-medium mb-1">CURRENT WEIGHT</p>
                    <p className="text-4xl font-bold">{currentWeight} kg</p>
                    {weightChange !== 0 && (
                    <p className={`text-sm mt-2 ${weightChange < 0 ? "text-green-200" : "text-red-200"}`}>
                        {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg from start
                    </p>
                    )}
                </Card>

                {/* Height */}
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <p className="text-purple-100 text-sm font-medium mb-1">HEIGHT</p>
                    <p className="text-4xl font-bold">{progressData.initial.height} cm</p>
                    <p className="text-sm text-purple-100 mt-2">
                    {(progressData.initial.height / 100).toFixed(2)} meters
                    </p>
                </Card>

                {/* Current BMI */}
                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <p className="text-green-100 text-sm font-medium mb-1">CURRENT BMI</p>
                    <p className="text-4xl font-bold">{currentBMI}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${bmiCategory.color}`}>
                    {bmiCategory.label}
                    </div>
                </Card>

                {/* Total Sessions */}
                <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <p className="text-orange-100 text-sm font-medium mb-1">TOTAL SESSIONS</p>
                    <p className="text-4xl font-bold">{progressData.sessions.length}</p>
                    <p className="text-sm text-orange-100 mt-2">Training sessions completed</p>
                </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Weight Progress Chart */}
                <Card className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Weight Progress</h2>
                    {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                        <YAxis style={{ fontSize: "12px" }} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", r: 5 }}
                            name="Weight (kg)"
                        />
                        </LineChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <p>No training sessions yet. Start training to see your progress!</p>
                    </div>
                    )}
                </Card>

                {/* BMI Progress Chart */}
                <Card className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">BMI Progress</h2>
                    {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                        <YAxis style={{ fontSize: "12px" }} domain={[0, 40]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bmi" fill="#10b981" name="BMI" />
                        </BarChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <p>No training sessions yet. Start training to see your BMI progress!</p>
                    </div>
                    )}
                </Card>
                </div>

                {/* Session History */}
                <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Session History</h2>
                <div className="space-y-4">
                    {/* Initial Record */}
                    <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                        <div>
                        <p className="font-bold text-gray-900">Starting Point</p>
                        <p className="text-sm text-gray-600">
                            {new Date(progressData.initial.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{progressData.initial.weight} kg</p>
                        <p className="text-sm text-gray-600">BMI: {initialBMI}</p>
                        </div>
                    </div>
                    </div>

                    {/* Sessions */}
                    {progressData.sessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">No training sessions logged yet</p>
                        <p className="text-sm">Your coach will log sessions as you train</p>
                    </div>
                    ) : (
                    progressData.sessions.map((session, index) => {
                        const sessionBMI = calculateBMI(session.weight, progressData.initial.height);
                        const prevWeight = index === 0 ? progressData.initial.weight : progressData.sessions[index - 1].weight;
                        const change = session.weight - prevWeight;

                        return (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                            <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-900">Session {index + 1}</p>
                                <p className="text-sm text-gray-600">
                                {new Date(session.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                                </p>
                                {session.notes && (
                                <p className="text-sm text-gray-700 mt-1 italic">&quot;{session.notes}&quot;</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{session.weight} kg</p>
                                <p className="text-sm text-gray-600">BMI: {sessionBMI}</p>
                                {change !== 0 && (
                                <p className={`text-sm font-semibold ${change < 0 ? "text-green-600" : "text-red-600"}`}>
                                    {change > 0 ? "+" : ""}{change.toFixed(1)} kg
                                </p>
                                )}
                            </div>
                            </div>
                        </div>
                        );
                    })
                    )}
                </div>
                </Card>
            </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
