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
import { useUser, isRegularUser } from "@/context/AuthContext";
import axios from "axios";

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  if (!user) return null;

  const navItems = [
    { href: "/Users/schedule", label: "MY SCHEDULE", icon: "uis:schedule" },
    { href: "/Users/application", label: "APPLICATION", icon: "lucide:vote"},
    { href: "/Users/settings", label: "SETTINGS", icon: "mdi:gear"},
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

  // ✅ Use type guard to safely access properties
  const displayName = isRegularUser(user) 
    ? `${user.firstname} ${user.lastname}`.trim() 
    : "User";
  
  const displayRole = user.role.toUpperCase();
  
  const profileImage = isRegularUser(user) 
    ? (user.image || "/user.png") 
    : "/user.png";

  return (
    <Sidebar className="py-4 pl-6">
      <SidebarHeader className="items-center mt-10 flex flex-col gap-2">
        <div className="w-28 h-28 overflow-hidden rounded-full border-2 border-[#0091ff]">
          <Image
            src={profileImage}
            alt={displayName}
            width={200}
            height={200}
            className="object-cover w-full h-full"
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