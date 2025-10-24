"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import axios from "axios";

export function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  // ✅ Don't show sidebar if user is not logged in
  if (!user) return null;

  const navItems = [

    { href: "/Coach/clients", label: "CLIENTS", icon: "nimbus:stats" },
    { href: "/Coach/Coachsettings", label: "SETTINGS", icon: "mdi:gear" },
  
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });

      if (res.status === 200) {
        await logout();
        router.push("/auth/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  // ✅ Type guard to check if user is a coach
  const isCoach = (user: any): user is { coach_name: string; profile_image?: string; role: string } => {
    return 'coach_name' in user;
  };

  // ✅ Get display name based on user type
  const displayName = isCoach(user) 
    ? user.coach_name 
    : `${(user as any).firstname || ''} ${(user as any).lastname || ''}`.trim() || "User";
  
  const displayRole = user.role?.toUpperCase() || "USER";
  
  // ✅ Ensure we always have a valid image path
const getProfileImage = () => {
  let imageUrl = "/user.png"; // default

  if (isCoach(user)) {
    imageUrl = user.profile_image ?? "/user.png";
  } else {
    imageUrl = (user as any).image ?? "/user.png";
  }

  // ✅ Always sanitize before returning
  if (
    !imageUrl ||
    imageUrl.trim() === "" ||
    imageUrl === "null" ||
    imageUrl === "undefined"
  ) {
    return "/user.png";
  }

  // ✅ If Supabase or HTTP image, return as is
  if (imageUrl.startsWith("http")) return imageUrl;

  // ✅ If it’s a relative path (like stored file), prefix properly
  if (imageUrl.startsWith("/")) return imageUrl;

  // ✅ Default fallback
  return `/user.png`;
};

  
  const profileImage = getProfileImage();

  return (
    <Sidebar className="py-4 pl-6">
      <SidebarHeader className="items-center mt-10 flex flex-col gap-2">
        <div className="w-28 h-28 overflow-hidden rounded-full border-2 border-[#0091ff]">
          <Image
            src={profileImage}
            alt={displayName}
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
        <div className="text-center mt-2">
          <h1 className="font-bold text-lg">{displayName}</h1>
          <p className="text-sm text-gray-500">{displayRole}</p>
        </div>
      </SidebarHeader>

      <div className="px-10">
        <Separator className="my-4" />
      </div>

      <SidebarContent className="px-5 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={`flex justify-start gap-2 ${
                isActive ? "bg-primary/90 text-white" : "hover:bg-primary/20"
              }`}
            >
              <Link href={item.href}>
                <Icon icon={item.icon} width="24" height="24" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </SidebarContent>

      <Button onClick={handleLogout} className="mx-5 mb-2">
        Log out
      </Button>
    </Sidebar>
  );
}