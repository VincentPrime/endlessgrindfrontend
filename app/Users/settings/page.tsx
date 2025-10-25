"use client"

import { useState, useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/userssidebar/user-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import RouteGuard from "@/components/protectedRoute/protectedRoutes"
import { useUser, isRegularUser } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { Usermobilesidebar } from "@/components/userssidebar/usermobilesidebar";

interface ErrorResponse {
  message?: string;
}

export default function Setting(){
    const { user, setUser } = useUser();
    const isMobile = useIsMobile()

    const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    address: "",
    email: "",
    password: "",
    });
    
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/user.png");
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (user && isRegularUser(user)) {
      setFormData({
        firstname: user.firstname || "",
        middlename: user.middlename || "",
        lastname: user.lastname || "",
        address: user.address || "",
        email: user.email || "",
        password: "",
      });
      setImagePreview(user.image || "/user.png");
    }
  }, [user]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formDataToSend = new FormData();

    // Only append fields that have values
    if (formData.firstname) formDataToSend.append("firstname", formData.firstname);
    if (formData.middlename) formDataToSend.append("middlename", formData.middlename);
    if (formData.lastname) formDataToSend.append("lastname", formData.lastname);
    if (formData.address) formDataToSend.append("address", formData.address);
    if (formData.email) formDataToSend.append("email", formData.email);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (profileImage) formDataToSend.append("profileImage", profileImage);

    const res = await axios.put(
      "/api/auth/update-profile",
      formDataToSend,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Update user in context and localStorage
    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    Swal.fire({
      text: "Profile updated successfully!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    // Clear password field after successful update
    setFormData({ ...formData, password: "" });
  } catch (err: unknown) {
    console.error("❌ Update error:", err);
    const error = err as AxiosError<ErrorResponse>;
    Swal.fire({
      text: error.response?.data?.message || "Update failed",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  } finally {
    setLoading(false);
  }
};

    return(
        <RouteGuard allowedRoles={["user"]}>
             <SidebarProvider>
            {!isMobile && <UserSidebar />}
            <SidebarInset>
            {isMobile &&  
            <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
                <Usermobilesidebar/>
            </header> 
            }
            <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2 ml-4 mt-2 text-2xl">Settings</h1>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <form onSubmit={handleUpdate}>
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover border-4 border-blue-500"
                    />
                  </div>
                  <label className="cursor-pointer">
                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Change Profile Picture
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF (Max 5MB)
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <Input
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Middle Name
                      </label>
                      <Input
                        name="middlename"
                        placeholder="Middle Name"
                        value={formData.middlename}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <Input
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password (leave blank to keep current)
                    </label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Only fill this if you want to change your password
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-12 px-8"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
                </div>
            </div>
            </SidebarInset>
         </SidebarProvider>
        </RouteGuard>
    )


}