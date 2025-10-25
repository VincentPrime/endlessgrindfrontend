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
import { useUser, isCoach as isCoachUser, isRegularUser } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

// ✅ Import or define the User types
interface RegularUser {
  user_id: number;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  email: string;
  role: "admin" | "user";
  image?: string;
}

interface CoachUser {
  user_id: number;
  coach_name: string;
  email: string;
  role: "coach";
  profile_image?: string;
}

type User = RegularUser | CoachUser;

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
      const res = await axios.post("/api/auth/logout", {}, { withCredentials: true });

      if (res.status === 200) {
        await logout();
        router.push("/auth/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error("Logout error:", err.response?.data?.message || err.message);
      alert("Logout failed");
    }
  };

  // ✅ Use the imported type guard from AuthContext
  const isCoach = (user: User): user is CoachUser => {
    return user.role === "coach";
  };

  // ✅ Get display name based on user type
  const displayName = isCoach(user) 
    ? user.coach_name 
    : `${(user as RegularUser).firstname || ''} ${(user as RegularUser).lastname || ''}`.trim() || "User";
  
  const displayRole = user.role?.toUpperCase() || "USER";
  
  // ✅ Ensure we always have a valid image path
  const getProfileImage = () => {
    let imageUrl = "/user.png"; // default

    if (isCoach(user)) {
      imageUrl = user.profile_image ?? "/user.png";
    } else {
      imageUrl = (user as RegularUser).image ?? "/user.png";
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

    // ✅ If it's a relative path (like stored file), prefix properly
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