"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios, {AxiosError} from "axios";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { uploadCoachImage } from "@/lib/supabase"; // Adjust path as needed
import Image from "next/image";
import Swal from "sweetalert2";


interface ErrorResponse {
  message?: string;
}

export function AddCoaches() {
  const [formData, setFormData] = useState({
    coach_name: "",
    email: "",
    password: "",
    bio: "",
    profile_image: "",
    specialty: "",
    certifications: "",
    years_of_experience: "",
    availability_day: "",
    availability_start: "",
    availability_end: "",
    performance_rating: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.profile_image;

      // Upload image to Supabase if file is selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadCoachImage(imageFile);
        setUploadingImage(false);
      }

      // Format availability as simple text
      const availabilityText = formData.availability_day && formData.availability_start && formData.availability_end
        ? `${formData.availability_day} ${formData.availability_start} to ${formData.availability_end}`
        : null;

      const payload = {
        coach_name: formData.coach_name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || null,
        profile_image: imageUrl || null,
        specialty: formData.specialty || null,
        certifications: formData.certifications || null,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        availability: availabilityText,
        performance_rating: parseFloat(formData.performance_rating) || 0.0,
      };
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.post("/api/coaches/signup", payload, {
        withCredentials: true,
      });

      await Swal.fire({
        text: "Coach Added successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        coach_name: "",
        email: "",
        password: "",
        bio: "",
        profile_image: "",
        specialty: "",
        certifications: "",
        years_of_experience: "",
        availability_day: "",
        availability_start: "",
        availability_end: "",
        performance_rating: "",
      });
      setImageFile(null);
      setImagePreview("");

      setIsOpen(false);
      window.location.reload();
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
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coach</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Coach</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSignup}>
          <Card className="flex flex-col items-center gap-4 bg-transparent border-none shadow-none">
            
            {/* COACH NAME */}
            <Input
              name="coach_name"
              placeholder="Coach Name"
              className="h-12 bg-white"
              value={formData.coach_name}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="h-12 bg-white"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* PASSWORD */}
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="h-12 bg-white"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* PROFILE IMAGE UPLOAD */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="h-12 bg-white"
              />
              {imagePreview && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* SPECIALTY */}
            <Input
              name="specialty"
              placeholder="Specialty (e.g. Fitness, Nutrition)"
              className="h-12 bg-white"
              value={formData.specialty}
              onChange={handleChange}
            />

            {/* CERTIFICATIONS */}
            <Input
              name="certifications"
              placeholder="Certifications"
              className="h-12 bg-white"
              value={formData.certifications}
              onChange={handleChange}
            />

            {/* YEARS OF EXPERIENCE */}
            <Input
              name="years_of_experience"
              type="number"
              placeholder="Years of Experience"
              className="h-12 bg-white"
              value={formData.years_of_experience}
              onChange={handleChange}
            />

            {/* PERFORMANCE RATING */}
            <Input
              name="performance_rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Performance Rating (0.0 - 5.0)"
              className="h-12 bg-white"
              value={formData.performance_rating}
              onChange={handleChange}
            />

            {/* AVAILABILITY - Simplified */}
            <div className="w-full space-y-2">
              <label className="block text-sm font-medium">Availability</label>
              <Input
                name="availability_day"
                placeholder="Day (e.g. Monday, Tuesday)"
                className="h-12 bg-white"
                value={formData.availability_day}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="availability_start"
                  type="time"
                  placeholder="Start Time"
                  className="h-12 bg-white"
                  value={formData.availability_start}
                  onChange={handleChange}
                />
                <Input
                  name="availability_end"
                  type="time"
                  placeholder="End Time"
                  className="h-12 bg-white"
                  value={formData.availability_end}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* BIO */}
            <textarea
              name="bio"
              placeholder="Short bio about the coach"
              className="w-full h-20 p-2 border rounded-lg bg-white"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={loading || uploadingImage}
            >
              {uploadingImage ? "Uploading Image..." : loading ? "Creating Coach..." : "Add Coach"}
            </Button>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}