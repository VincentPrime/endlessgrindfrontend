"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/adminsidebar/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { AddCoaches } from "@/components/adminsModal/addcoach"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Swal from "sweetalert2";

interface Coach {
  coach_id: number;
  coach_name: string;
  email: string;
  bio?: string;
  specialty?: string;
  certifications?: string;
  years_of_experience?: number;
  performance_rating?: number;
  total_clients_trained?: number;
  is_active?: boolean;
}

export default function Coaches() {
  const isMobile = useIsMobile()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Fetch all coaches
  const fetchCoaches = async () => {
  setLoading(true)
  try {
    const res = await axios.get("http://localhost:4000/api/coaches/all", {
      withCredentials: true,
    })

    // 🧩 FIX: make sure you use the actual array
    setCoaches(res.data.coaches || [])
  } catch (err: any) {
    console.error("Error fetching coaches:", err)
    alert(err.response?.data?.message || "Failed to fetch coaches")
  } finally {
    setLoading(false)
  }
}

  // ✅ Delete coach
const handleDelete = async (id: number) => {
  const result = await Swal.fire({
    title: "Are you sure you want to delete this coach?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:4000/api/coaches/delete/${id}`, {
        withCredentials: true,
      });

      await Swal.fire({
        title: "Deleted!",
        text: "Coach deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh the list
      fetchCoaches();
    } catch (err: any) {
      console.error("Error deleting coach:", err);

      Swal.fire({
        title: "Error!",
        text:  "This coach currently has an active client and cannot be deleted until all sessions are completed.",
        icon: "error",
      });
    }
  }
};

  useEffect(() => {
    fetchCoaches()
  }, [])

  // ✅ Search filter - now using coach_name instead of firstname/middlename/lastname
  const filteredCoaches = coaches.filter((c) =>
    c.coach_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SidebarProvider>
      {!isMobile && <AppSidebar />}
      <SidebarInset>
        {isMobile && (
          <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 border-b-black px-11 py-2">
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
                <h1 className="text-xl">Vincent Fillar</h1>
                <h1 className="text-gray-500">Web Developer</h1>
              </div>
            </div>
          </header>
        )}

        <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2">List of Coaches</h1>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Top controls */}
          <div className="flex flex-col xl:flex-row gap-3">
            <AddCoaches />

            <div className="flex gap-2 ml-auto">
              <Input
                placeholder="Search Coach"
                className="xl:w-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => fetchCoaches()} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-100 min-h-[80vh] flex-1 rounded-xl md:min-h-min overflow-x-auto shadow-md">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading coaches...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 border-b">#</th>
                    <th className="px-6 py-3 border-b">Coach Name</th>
                    <th className="px-6 py-3 border-b">Email</th>
                    <th className="px-6 py-3 border-b">Specialty</th>
                    <th className="px-6 py-3 border-b">Experience</th>
                    <th className="px-6 py-3 border-b">Rating</th>
                    <th className="px-6 py-3 border-b">Status</th>
                    <th className="px-6 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.length > 0 ? (
                    filteredCoaches.map((coach, index) => (
                      <tr
                        key={coach.coach_id}
                        className="hover:bg-gray-200 transition-colors"
                      >
                        <td className="px-6 py-3 border-b">{index + 1}</td>
                        <td className="px-6 py-3 border-b font-semibold">
                          {coach.coach_name}
                        </td>
                        <td className="px-6 py-3 border-b">{coach.email}</td>
                        <td className="px-6 py-3 border-b">
                          {coach.specialty || "N/A"}
                        </td>
                        <td className="px-6 py-3 border-b">
                          {coach.years_of_experience || 0} years
                        </td>
                        <td className="px-6 py-3 border-b">
                          {coach.performance_rating || "N/A"} ⭐
                        </td>
                        <td className="px-6 py-3 border-b">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              coach.is_active
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {coach.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-b text-center">
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(coach.coach_id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-6 text-gray-500"
                      >
                        No coaches found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}