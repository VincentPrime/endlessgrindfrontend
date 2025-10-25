"use client"
import { useState, useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coachsidebar/coach-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import RouteGuard from "@/components/protectedRoute/protectedRoutes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/AuthContext"
import { uploadCoachImage } from "@/lib/supabase"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { Coachmobilesidebar } from "@/components/coachsidebar/coachmobilesidebar"

// ✅ REMOVED duplicate CoachUser interface - using the one from AuthContext

interface UpdatePayload {
  coach_name?: string;
  email?: string;
  password?: string;
  specialty?: string;
  years_of_experience?: number;
  availability?: string;
  profile_image?: string;
}

export default function CoachSettings() {
  const isMobile = useIsMobile()
  const { user, setUser } = useUser()
  
  const [formData, setFormData] = useState({
    coach_name: "",
    email: "",
    password: "",
    specialty: "",
    years_of_experience: "",
    availability: "",
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load current coach data
  useEffect(() => {
    if (user && user.role === "coach") {
      setFormData({
        coach_name: user.coach_name || "",
        email: user.email || "",
        password: "", // Never pre-fill password
        specialty: user.specialty || "",
        years_of_experience: user.years_of_experience?.toString() || "",
        availability: user.availability || "",
      })
      
      if (user.profile_image) {
        setImagePreview(user.profile_image)
      }
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ No need to cast - TypeScript knows user is CoachUser in this block
      if (!user || user.role !== "coach") return;
      
      // Build payload with only changed fields
      const payload: UpdatePayload = {}
      
      if (formData.coach_name && formData.coach_name !== user.coach_name) {
        payload.coach_name = formData.coach_name
      }
      
      if (formData.email && formData.email !== user.email) {
        payload.email = formData.email
      }
      
      if (formData.password) {
        payload.password = formData.password
      }
      
      if (formData.specialty && formData.specialty !== user.specialty) {
        payload.specialty = formData.specialty
      }
      
      if (formData.years_of_experience && formData.years_of_experience !== user.years_of_experience?.toString()) {
        payload.years_of_experience = parseInt(formData.years_of_experience)
      }
      
      if (formData.availability && formData.availability !== user.availability) {
        payload.availability = formData.availability
      }

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true)
        const imageUrl = await uploadCoachImage(imageFile)
        payload.profile_image = imageUrl
        setUploadingImage(false)
      }

      // Check if there's anything to update
      if (Object.keys(payload).length === 0) {
        await Swal.fire({
          text: "No changes detected.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        })
        setLoading(false)
        return
      }

      // Send update request
      const res = await axios.put<{ success: boolean; coach: Partial<typeof user> }>(
        `/api/coaches/update/${user.user_id}`,
        payload,
        { withCredentials: true }
      )

      if (res.data.success) {
        // ✅ Update user context - now type-safe!
        const updatedUser = { 
          ...user, 
          ...res.data.coach,
          user_id: user.user_id,
          role: 'coach' as const
        };
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        await Swal.fire({
          text: "Profile updated successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })

        // Clear password field and image file
        setFormData({ 
          ...formData, 
          password: "",
          coach_name: updatedUser.coach_name || formData.coach_name,
          email: updatedUser.email || formData.email,
          specialty: updatedUser.specialty || formData.specialty,
          years_of_experience: updatedUser.years_of_experience?.toString() || formData.years_of_experience,
          availability: updatedUser.availability || formData.availability,
        })
        
        setImageFile(null)
      }
    } catch (err) {
      console.error(err)
      const error = err as AxiosError<{ message?: string }>;
      await Swal.fire({
        text: error.response?.data?.message || "Failed to update profile.",
        icon: "error",
      })
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  return (
    <RouteGuard allowedRoles={["coach"]}>
      <SidebarProvider>
        {!isMobile && <CoachSidebar />}
        <SidebarInset>
          {isMobile && (
            <header className="sticky top-0 z-50 bg-white flex shrink-0 items-center gap-2 border-b-2 px-5 py-2">
                <Coachmobilesidebar/>
            </header>
          )}
          
          <h1 className="font-bold xl:text-6xl xl:ml-4 xl:mt-2 ml-4 mt-2 text-2xl">Settings</h1>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="bg-white min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                
                {/* Profile Image */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Profile Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Upload a new image to change your profile picture</p>
                </div>

                {/* Coach Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Coach Name</label>
                  <Input
                    name="coach_name"
                    placeholder="Your name"
                    value={formData.coach_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">Only fill this if you want to change your password</p>
                </div>

                {/* Specialty */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Specialty</label>
                  <Input
                    name="specialty"
                    placeholder="e.g., Fitness, Nutrition, Strength Training"
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Years of Experience</label>
                  <Input
                    name="years_of_experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                  />
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Availability</label>
                  <Input
                    name="availability"
                    placeholder="e.g., Monday 10:00am to 11:00am"
                    value={formData.availability}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || uploadingImage}
                >
                  {uploadingImage ? "Uploading Image..." : loading ? "Saving Changes..." : "Save Changes"}
                </Button>

                <p className="text-sm text-center text-gray-500">
                  You only need to fill in the fields you want to change
                </p>
              </form>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  )
}