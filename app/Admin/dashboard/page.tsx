"use client"
import { useEffect, useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/adminsidebar/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import RouteGuard from "@/components/protectedRoute/protectedRoutes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, UserCheck, Package, } from 'lucide-react'
import { Adminmobilesidebar } from "@/components/adminsidebar/adminmobilesidebar"

interface DashboardStats {
  totalUsers: number
  totalCoaches: number
  totalPackages: number
}

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: {
    month: string
    monthName: string
    applications: number
    revenue: number
  }[]
  revenueByPackage: {
    packageName: string
    sales: number
    revenue: number
  }[]
}

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // ✅ FIXED: Using session-based auth with credentials: 'include'
      // This sends the session cookie automatically
      
      // Fetch stats
      const statsRes = await fetch('http://localhost:4000/api/stats', {
        method: 'GET',
        credentials: 'include', // ⭐ This is crucial for session cookies!
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Fetch revenue data
      const revenueRes = await fetch('http://localhost:4000/api/revenue', {
        method: 'GET',
        credentials: 'include', // ⭐ This is crucial for session cookies!
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!statsRes.ok || !revenueRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const statsData = await statsRes.json()
      const revenueDataRes = await revenueRes.json()

      setStats(statsData.data)
      setRevenueData(revenueDataRes.data)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <SidebarProvider>
        {!isMobile && <AppSidebar />}
        <SidebarInset>
          {isMobile && (
            <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
              <Adminmobilesidebar/>
            </header>
          )}
          
          <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2 ml-4 mt-2 text-2xl">Dashboard</h1>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Stats Cards */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {/* Total Users Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 aspect-video rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between h-full flex-col">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Total Users</p>
                    {loading ? (
                      <div className="h-10 w-20 bg-white/20 rounded animate-pulse mt-1" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-1">
                        {stats?.totalUsers || 0}
                      </h2>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Coaches Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 aspect-video rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between h-full flex-col">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <UserCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Active Coaches</p>
                    {loading ? (
                      <div className="h-10 w-20 bg-white/20 rounded animate-pulse mt-1" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-1">
                        {stats?.totalCoaches || 0}
                      </h2>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Packages Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 aspect-video rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between h-full flex-col">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Package className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Active Packages</p>
                    {loading ? (
                      <div className="h-10 w-20 bg-white/20 rounded animate-pulse mt-1" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-1">
                        {stats?.totalPackages || 0}
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Revenue Overview</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Total revenue from completed memberships
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  {loading ? (
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(revenueData?.totalRevenue || 0)}
                    </p>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-500">Loading revenue data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <button 
                      onClick={fetchDashboardData}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Monthly Revenue Line Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData?.monthlyRevenue || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="monthName" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `₱${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelStyle={{ color: '#000' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="Revenue"
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue by Package Bar Chart */}
                  {revenueData?.revenueByPackage && revenueData.revenueByPackage.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Revenue by Package</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData.revenueByPackage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="packageName" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `₱${value.toLocaleString()}`}
                          />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelStyle={{ color: '#000' }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="revenue" 
                            fill="#8b5cf6" 
                            name="Revenue"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  )
}