"use client"
import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/adminsidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Swal from 'sweetalert2';
import { Adminmobilesidebar } from '@/components/adminsidebar/adminmobilesidebar';
import Image from 'next/image';

interface Application {
  application_id: number;
  user_id: number;
  username: string;
  name: string;
  nickname: string;
  sex: string;
  age: number;
  date_of_birth: string;
  email: string;
  facebook: string;
  address: string;
  goal: string;
  id_picture_url: string; // NEW: Added ID picture URL
  weight: number;
  height: number;
  package_id: number;
  package_title: string;
  package_price: number;
  coach_id: number;
  coach_name: string;
  waiver_accepted: boolean;
  payment_status: 'pending' | 'completed' | 'refunded' | 'failed';
  payment_id: string;
  application_status: 'pending' | 'approved' | 'declined';
  submitted_at: string;
  reviewed_at: string;
  reviewed_by: number;
  reviewed_by_name: string;
}

export default function ApplicationNotice() {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/all', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: number) => {
    const result = await Swal.fire({
      title: "Approve Application?",
      text: "Are you sure you want to approve this application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/approve`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Approved!",
          text: "The application has been approved successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchApplications();
        setSelectedApp(null);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "Failed to approve application.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error approving application:", error);

      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (applicationId: number) => {
    const result = await Swal.fire({
      title: "Decline Application?",
      text: "Are you sure you want to decline this application? Payment will be refunded if completed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, decline it!",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/decline`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Declined!",
          text: data.refund_initiated
            ? "Application declined and refund has been initiated."
            : "Application declined successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchApplications();
        setSelectedApp(null);
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to decline application.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error declining application:", error);

      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while declining the application.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (applicationId: number) => {
    const result = await Swal.fire({
      title: "Archive Application?",
      text: "This will move the application to archive and cancel any active membership. The user will be able to apply again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, archive it!",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/archive`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Archived!",
          text: data.membership_cancelled
            ? "Application archived and membership cancelled."
            : "Application archived successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchApplications();
        setSelectedApp(null);
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to archive application.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error archiving application:", error);

      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while archiving the application.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.application_status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status: string) => {
    const badges = {
      pending: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      refunded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      <SidebarInset>
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-11 py-2">
            <Adminmobilesidebar/>
          </header>
        )}

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Membership Applications</h1>
            <p className="text-gray-600">Review and manage membership applications</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {(['all', 'pending', 'approved', 'declined'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab} ({applications.filter(a => tab === 'all' || a.application_status === tab).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading applications...</div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">No applications found</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.application_id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">{app.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.application_status)}`}>
                        {app.application_status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(app.payment_status)}`}>
                        {app.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Package</p>
                      <p className="font-semibold">{app.package_title}</p>
                      <p className="text-sm text-green-600">₱{app.package_price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Coach</p>
                      <p className="font-semibold">{app.coach_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Age / Sex</p>
                      <p className="font-semibold">{app.age} / {app.sex}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="font-semibold">{new Date(app.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      View Details
                    </button>
                    
                    {/* Pending applications */}
                    {app.application_status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors disabled:bg-gray-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors disabled:bg-gray-400"
                        >
                          Decline {app.payment_status === 'completed' ? '& Refund' : ''}
                        </button>
                        <button
                          onClick={() => handleArchive(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors disabled:bg-gray-400 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Archive
                        </button>
                      </>
                    )}

                    {/* Approved applications */}
                    {app.application_status === 'approved' && (
                      <>
                        <span className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-md flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Approved on {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                        </span>
                        <button
                          onClick={() => handleArchive(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors disabled:bg-gray-400 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Archive
                        </button>
                      </>
                    )}

                    {/* Declined applications */}
                    {app.application_status === 'declined' && (
                      <>
                        <span className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Declined on {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                        </span>
                        <button
                          onClick={() => handleArchive(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors disabled:bg-gray-400 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Archive
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Badges */}
                <div className="flex gap-2 pb-4 border-b">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedApp.application_status)}`}>
                    Status: {selectedApp.application_status}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentBadge(selectedApp.payment_status)}`}>
                    Payment: {selectedApp.payment_status}
                  </span>
                </div>

                {/* NEW: ID Picture Display */}
                {selectedApp.id_picture_url && (
                  <div className="pb-4 border-b">
                    <p className="text-sm font-medium text-gray-700 mb-3">ID Picture for Verification</p>
                    <div className="relative w-full max-w-md mx-auto">
                      <Image
                        src={selectedApp.id_picture_url}
                        alt="ID Verification"
                        fill
                        className="w-full h-auto rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-id.png'; // Fallback image
                          e.currentTarget.alt = 'ID image not available';
                        }}
                      />
                      <a
                        href={selectedApp.id_picture_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open full size
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold">{selectedApp.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nickname</p>
                    <p className="font-semibold">{selectedApp.nickname || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Facebook</p>
                    <p className="font-semibold">{selectedApp.facebook || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age / DOB</p>
                    <p className="font-semibold">{selectedApp.age} / {new Date(selectedApp.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sex</p>
                    <p className="font-semibold">{selectedApp.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">{selectedApp.weight ? `${selectedApp.weight} kg` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold">{selectedApp.height ? `${selectedApp.height} cm` : 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold">{selectedApp.address || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fitness Goal</p>
                  <p className="font-semibold">{selectedApp.goal}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-semibold">{selectedApp.package_title}</p>
                    <p className="text-green-600 font-bold">₱{selectedApp.package_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coach</p>
                    <p className="font-semibold">{selectedApp.coach_name}</p>
                  </div>
                </div>

                {selectedApp.reviewed_by_name && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Reviewed By</p>
                    <p className="font-semibold">{selectedApp.reviewed_by_name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedApp.reviewed_at ? new Date(selectedApp.reviewed_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                )}

                {selectedApp.application_status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => handleApprove(selectedApp.application_id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => handleDecline(selectedApp.application_id)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                    >
                      {actionLoading ? 'Processing...' : `Decline${selectedApp.payment_status === 'completed' ? ' & Refund' : ''}`}
                    </button>
                    <button
                      onClick={() => handleArchive(selectedApp.application_id)}
                      disabled={actionLoading}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
                    >
                      {actionLoading ? 'Processing...' : 'Archive'}
                    </button>
                  </div>
                )}

                {/* Archive button for approved/declined applications */}
                {(selectedApp.application_status === 'approved' || selectedApp.application_status === 'declined') && (
                  <div className="pt-4">
                    <button
                      onClick={() => handleArchive(selectedApp.application_id)}
                      disabled={actionLoading}
                      className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {actionLoading ? 'Archiving...' : 'Archive Application'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}