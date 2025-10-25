"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Coachmobilesidebar() {
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
      const res = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );

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
  const isCoach = (
    user: any
  ): user is { coach_name: string; profile_image?: string; role: string } => {
    return "coach_name" in user;
  };

  // ✅ Get display name based on user type
  const displayName = isCoach(user)
    ? user.coach_name
    : `${(user as any).firstname || ""} ${(user as any).lastname || ""}`.trim() ||
      "User";

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

    // ✅ If it's a relative path (like stored file), prefix properly
    if (imageUrl.startsWith("/")) return imageUrl;

    // ✅ Default fallback
    return `/user.png`;
  };

  const profileImage = getProfileImage();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-none">
          <Icon icon="material-symbols:menu-rounded" width="24" height="24" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        {/* Header with Profile */}
        <SheetHeader className="items-center mt-6 flex flex-col gap-2">
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
            <SheetTitle className="font-bold text-lg">{displayName}</SheetTitle>
            <p className="text-sm text-gray-500">{displayRole}</p>
          </div>
        </SheetHeader>

        <div className="px-4">
          <Separator className="my-4" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SheetClose asChild key={item.href}>
                <Button
                  asChild
                  variant="ghost"
                  className={`flex justify-start gap-2 ${
                    isActive
                      ? "bg-primary/90 text-white"
                      : "hover:bg-primary/20"
                  }`}
                >
                  <Link href={item.href}>
                    <Icon icon={item.icon} width="24" height="24" />
                    {item.label}
                  </Link>
                </Button>
              </SheetClose>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-4">
          <Button onClick={handleLogout} className="w-full">
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}