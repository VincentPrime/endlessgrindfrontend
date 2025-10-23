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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Swal from "sweetalert2"

interface User {
  user_id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  sex: string;
  civil_status: string;
  date_of_birth: string;
  role: string;
  created_at?: string;
}

export default function Users() {
  const isMobile = useIsMobile()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Fetch all users
  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:4000/api/auth/allUsers", {
        withCredentials: true,
      })
      setUsers(res.data)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      alert(err.response?.data?.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete user
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/auth/delete/${id}`, {
          withCredentials: true,
        });

        await Swal.fire({
          title: "Deleted!",
          text: "User deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh user list
        fetchAllUsers();
      } catch (err: any) {
        console.error("Error deleting user:", err);

        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to delete user.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchAllUsers()
  }, [])

  // ✅ Search filter
  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.middlename || ''} ${user.lastname}`
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
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

        <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2">List of Users</h1>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Top controls */}
          <div className="flex flex-col xl:flex-row gap-3">
            <div className="flex gap-2 ml-auto">
              <Input
                placeholder="Search Users"
                className="xl:w-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => fetchAllUsers()} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-100 min-h-[80vh] flex-1 rounded-xl md:min-h-min overflow-x-auto shadow-md">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 border-b">#</th>
                    <th className="px-6 py-3 border-b">Full Name</th>
                    <th className="px-6 py-3 border-b">Email</th>
                    <th className="px-6 py-3 border-b">Sex</th>
                    <th className="px-6 py-3 border-b">Civil Status</th>
                    <th className="px-6 py-3 border-b">Role</th>
                    <th className="px-6 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.user_id}
                        className="hover:bg-gray-200 transition-colors"
                      >
                        <td className="px-6 py-3 border-b">{index + 1}</td>
                        <td className="px-6 py-3 border-b font-semibold">
                          {user.firstname}{" "}
                          {user.middlename ? user.middlename + " " : ""}
                          {user.lastname}
                        </td>
                        <td className="px-6 py-3 border-b">{user.email}</td>
                        <td className="px-6 py-3 border-b">{user.sex}</td>
                        <td className="px-6 py-3 border-b">{user.civil_status}</td>
                        <td className="px-6 py-3 border-b">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-b text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user.user_id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        No users found.
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