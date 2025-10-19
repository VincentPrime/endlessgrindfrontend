"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCoaches() {
  const [formData, setFormData] = useState({
    user_id: "", // Add this field
    coach_name: "",
    email: "",
    password: "",
    bio: "",
    profile_image: "",
    specialty: "",
    certifications: "",
    years_of_experience: "",
    availability: "",
    performance_rating: "",
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the data to match backend expectations
      const payload = {
        user_id: parseInt(formData.user_id), // Convert to number
        coach_name: formData.coach_name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || null,
        profile_image: formData.profile_image || null,
        specialty: formData.specialty || null,
        certifications: formData.certifications || null,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        availability: formData.availability ? JSON.parse(formData.availability) : null,
      };

      const res = await axios.post("http://localhost:4000/api/coaches/signup", payload, {
        withCredentials: true,
      });

      alert(res.data.message || "Coach added successfully!");

      // Reset form
      setFormData({
        user_id: "",
        coach_name: "",
        email: "",
        password: "",
        bio: "",
        profile_image: "",
        specialty: "",
        certifications: "",
        years_of_experience: "",
        availability: "",
        performance_rating: "",
      });

      setIsOpen(false); // Close dialog
      window.location.reload(); // Refresh to show new coach
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coach</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Coach</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSignup}>
          <Card className="flex flex-col items-center gap-4 bg-transparent border-none shadow-none">
            
            {/* USER ID (required by backend) */}
            <Input
              name="user_id"
              type="number"
              placeholder="User ID (unique)"
              className="h-12 bg-white"
              value={formData.user_id}
              onChange={handleChange}
              required
            />

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

            {/* AVAILABILITY (JSON format helper) */}
            <Input
              name="availability"
              placeholder='Availability (e.g. {"Monday":["9:00-12:00"]})'
              className="h-12 bg-white"
              value={formData.availability}
              onChange={handleChange}
            />

            {/* PROFILE IMAGE */}
            <Input
              name="profile_image"
              placeholder="Profile Image URL"
              className="h-12 bg-white"
              value={formData.profile_image}
              onChange={handleChange}
            />

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
              disabled={loading}
            >
              {loading ? "Creating Coach..." : "Add Coach"}
            </Button>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}