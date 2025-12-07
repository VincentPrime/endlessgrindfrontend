"use client"
import { useEffect, useState } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/adminsidebar/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import RouteGuard from "@/components/protectedRoute/protectedRoutes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, UserCheck, Package, Printer } from 'lucide-react'
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

interface Application {
  application_id: number
  user_id: number
  username: string
  name: string
  email: string
  package_title: string
  package_price: number
  coach_name: string
  payment_status: string
  application_status: string
  submitted_at: string
  reviewed_at: string
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
      
      const statsRes = await fetch('/api/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const revenueRes = await fetch('/api/revenue', {
        method: 'GET',
        credentials: 'include',
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

  const handlePrintRevenue = async () => {
    try {
      // Fetch all applications
      const response = await fetch('/api/applications/all', {
        credentials: 'include'
      });
      const data = await response.json();

      console.log('API Response:', data); // DEBUG

      if (!data.success) {
        alert('Failed to fetch applications data');
        return;
      }

      console.log('All applications:', data.applications); // DEBUG

      // Filter only approved applications with completed payment
      const approvedApps = data.applications.filter(
        (app: Application) => app.application_status === 'approved' && app.payment_status === 'completed'
      );

      console.log('Approved apps:', approvedApps); // DEBUG
      console.log('Number of approved apps:', approvedApps.length); // DEBUG

      // Calculate total revenue
      const totalRevenue = approvedApps.reduce(
        (sum: number, app: Application) => sum + Number(app.package_price || 0), 
        0
      );

      console.log('Total Revenue:', totalRevenue); // DEBUG

      // Open print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups to print the revenue report');
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Revenue Report - Endless Grind Fitness</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 32px;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .header p {
              color: #666;
              font-size: 16px;
            }
            .summary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
              text-align: center;
            }
            .summary h2 {
              font-size: 18px;
              font-weight: normal;
              margin-bottom: 10px;
              opacity: 0.9;
            }
            .summary .amount {
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .summary .count {
              font-size: 16px;
              opacity: 0.9;
            }
            .section-title {
              font-size: 22px;
              font-weight: bold;
              color: #1e40af;
              margin: 30px 0 15px 0;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th {
              background-color: #2563eb;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
              text-transform: uppercase;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
            }
            tr:hover {
              background-color: #f9fafb;
            }
            .amount-cell {
              font-weight: 600;
              color: #059669;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .summary {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              th {
                background-color: #2563eb !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REVENUE REPORT</h1>
            <p>Endless Grind Fitness - Membership Revenue Summary</p>
            <p style="margin-top: 10px; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div class="summary">
            <h2>Total Revenue</h2>
            <div class="amount">₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="count">${approvedApps.length} Approved Membership${approvedApps.length !== 1 ? 's' : ''}</div>
          </div>

          <div class="section-title">Approved Memberships</div>
          
          ${approvedApps.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 20%;">Member Name</th>
                  <th style="width: 20%;">Package</th>
                  <th style="width: 15%;">Coach</th>
                  <th style="width: 15%;">Amount</th>
                  <th style="width: 15%;">Date Approved</th>
                  <th style="width: 10%;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${approvedApps.map((app: Application, index: number) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><strong>${app.name}</strong><br/><small style="color: #6b7280;">${app.email}</small></td>
                    <td>${app.package_title}</td>
                    <td>${app.coach_name}</td>
                    <td class="amount-cell">₱${app.package_price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}</td>
                    <td><span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">PAID</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
              <p>No approved memberships found.</p>
            </div>
          `}

          <div class="footer">
            <p><strong>Endless Grind Fitness</strong></p>
            <p>This is an automated revenue report generated from the admin dashboard</p>
            <p style="margin-top: 5px;">For internal use only - Confidential</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

    } catch (error) {
      console.error('Error printing revenue report:', error);
      alert('Failed to generate revenue report');
    }
  };

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
                <div className="flex items-center gap-4">
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
                  <button
                    onClick={handlePrintRevenue}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Printer className="h-4 w-4" />
                    Print Report
                  </button>
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