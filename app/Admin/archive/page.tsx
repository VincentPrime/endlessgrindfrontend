"use client"
import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/adminsidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Swal from 'sweetalert2';
import { Adminmobilesidebar } from '@/components/adminsidebar/adminmobilesidebar';

interface ArchivedApplication {
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
  training_status: 'not_started' | 'ongoing' | 'completed' | 'cancelled';
  submitted_at: string;
  reviewed_at: string;
  reviewed_by: number;
  archived_at: string;
  archived_by: number;
  archived_by_name: string;
  archive_reason: string;
}

export default function ArchivedApplications() {
  const isMobile = useIsMobile();
  const [archivedApps, setArchivedApps] = useState<ArchivedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ArchivedApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchArchivedApplications();
  }, []);

  const fetchArchivedApplications = async () => {
    try {
      const response = await fetch('/api/applications/archived/all', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setArchivedApps(data.archived_applications);
      }
    } catch (error) {
      console.error('Error fetching archived applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (applicationId: number) => {
    const result = await Swal.fire({
      title: "Permanently Delete?",
      text: "This action cannot be undone. The archived application will be permanently removed from the database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently!",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/applications/archived/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Archived application has been permanently deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchArchivedApplications();
        setSelectedApp(null);
        setSelectedIds(new Set());
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to delete archived application.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting archived application:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (archivedApps.length === 0) {
      Swal.fire({
        title: "No Archives",
        text: "There are no archived applications to delete.",
        icon: "info",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Delete ALL Archived Applications?",
      html: `<p>This will <strong>permanently delete all ${archivedApps.length} archived application(s)</strong>.</p><p style="color: #d33; font-weight: bold;">This action CANNOT be undone!</p>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all permanently!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/applications/archived/delete-all', {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Deleted!",
          text: `${data.deleted_count} archived application(s) permanently deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchArchivedApplications();
        setSelectedIds(new Set());
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to delete archived applications.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting all archives:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select at least one application to delete.",
        icon: "info",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Delete ${selectedIds.size} Selected Application(s)?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete selected!",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/applications/archived/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
      );

      await Promise.all(deletePromises);

      await Swal.fire({
        title: "Deleted!",
        text: `${selectedIds.size} application(s) permanently deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchArchivedApplications();
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error deleting selected archives:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting.",
        icon: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === archivedApps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(archivedApps.map(app => app.application_id)));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Archived Applications</h1>
            <p className="text-gray-600">View and manage archived membership applications</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {archivedApps.length > 0 && (
              <>
                <button
                  onClick={toggleSelectAll}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {selectedIds.size === archivedApps.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {selectedIds.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete Selected ({selectedIds.size})
                  </button>
                )}

                <button
                  onClick={handleDeleteAll}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete All Archives
                </button>
              </>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading archived applications...</div>
            </div>
          ) : archivedApps.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-gray-500">No archived applications found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {archivedApps.map((app) => (
                <div
                  key={app.application_id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${
                    selectedIds.has(app.application_id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.application_id)}
                      onChange={() => toggleSelection(app.application_id)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.username}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.application_status)}`}>
                            {app.application_status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.training_status)}`}>
                            {app.training_status}
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
                          <p className="text-xs text-gray-500">Archived On</p>
                          <p className="font-semibold">{new Date(app.archived_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Archived By</p>
                          <p className="font-semibold">{app.archived_by_name}</p>
                        </div>
                      </div>

                      {app.archive_reason && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-500">Archive Reason</p>
                          <p className="text-sm font-medium text-gray-700">{app.archive_reason}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSingle(app.application_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:bg-gray-400 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Archived Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Badges */}
                <div className="flex gap-2 pb-4 border-b flex-wrap">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedApp.application_status)}`}>
                    Status: {selectedApp.application_status}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedApp.training_status)}`}>
                    Training: {selectedApp.training_status}
                  </span>
                </div>

                {/* Archive Information */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Archived Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Archived On</p>
                      <p className="font-semibold text-gray-900">{new Date(selectedApp.archived_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Archived By</p>
                      <p className="font-semibold text-gray-900">{selectedApp.archived_by_name}</p>
                    </div>
                    {selectedApp.archive_reason && (
                      <div className="col-span-2">
                        <p className="text-gray-600">Reason</p>
                        <p className="font-semibold text-gray-900">{selectedApp.archive_reason}</p>
                      </div>
                    )}
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Original Submission</p>
                    <p className="font-semibold">{new Date(selectedApp.submitted_at).toLocaleString()}</p>
                  </div>
                  {selectedApp.reviewed_at && (
                    <div>
                      <p className="text-sm text-gray-500">Reviewed On</p>
                      <p className="font-semibold">{new Date(selectedApp.reviewed_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleDeleteSingle(selectedApp.application_id)}
                    disabled={actionLoading}
                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {actionLoading ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}