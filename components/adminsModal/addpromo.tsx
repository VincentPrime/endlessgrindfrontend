"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Swal from "sweetalert2";

interface AddPackageProps {
  onPackageAdded?: () => void;
}

export function AddPackage({ onPackageAdded }: AddPackageProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    pictureFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, pictureFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.pictureFile) {
        alert("Please select an image!");
        setLoading(false);
        return;
      }

      // 🖼 Upload to Supabase
      const file = form.pictureFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("promo")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("promo").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // 📤 Send to backend
      const res = await axios.post("http://localhost:4000/api/create", {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        picture: publicUrl,
      });

      if (res.status === 201) {
        await Swal.fire({
            text: "Package Added successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        setForm({
          title: "",
          description: "",
          price: "",
          pictureFile: null,
        });
        setOpen(false);
        if (onPackageAdded) onPackageAdded();
      } else {
        alert("Failed to add package.");
      }
    } catch (err) {
      console.error("Error adding package:", err);
      alert("Something went wrong while adding the package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Package</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Card className="flex flex-col items-center gap-4 bg-transparent border-none shadow-none">
            <Input
              name="title"
              placeholder="Title*"
              required
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              className="h-12 bg-white"
            />

            <Textarea
              name="description"
              placeholder="Description*"
              required
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              className="min-h-[100px] bg-white"
            />

            <Input
              name="picture"
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              disabled={loading}
              className="h-12 bg-white"
            />

            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price*"
              required
              value={form.price}
              onChange={handleChange}
              disabled={loading}
              className="h-12 bg-white"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Uploading..." : "Add Package"}
            </Button>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
}
