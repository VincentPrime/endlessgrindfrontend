"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, isRegularUser } from "@/context/AuthContext";
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

export function Usermobilesidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  if (!user) return null;

  const navItems = [
    { href: "/Users/schedule", label: "MY SCHEDULE", icon: "uis:schedule" },
    { href: "/Users/application", label: "APPLICATION", icon: "lucide:vote" },
    { href: "/Users/settings", label: "SETTINGS", icon: "mdi:gear" },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/logout",
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

  // ✅ Use type guard to safely access properties
  const displayName = isRegularUser(user)
    ? `${user.firstname} ${user.lastname}`.trim()
    : "User";

  const displayRole = user.role.toUpperCase();

  const profileImage = isRegularUser(user)
    ? user.image || "/user.png"
    : "/user.png";

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
              className="object-cover w-full h-full"
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