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

export function Adminmobilesidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useUser();

  const navItems = [
    {
      href: "/Admin/dashboard",
      label: "DASHBOARD",
      icon: "material-symbols-light:dashboard-rounded",
    },
    {
      href: "/Admin/coaches",
      label: "LIST OF COACHES",
      icon: "mdi:whistle",
    },
    {
      href: "/Admin/users",
      label: "LIST OF USERS",
      icon: "material-symbols:person-rounded",
    },
    { href: "/Admin/schedule", label: "SCHEDULE", icon: "uis:schedule" },
    {
      href: "/Admin/package",
      label: "PROMOS/PACKAGE",
      icon: "mdi:package",
    },
    {
      href: "/Admin/applicationnotice",
      label: "APPLICATION NOTICE",
      icon: "ri:megaphone-fill",
    },
    {
      href: "/Admin/archive",
      label: "ARCHIVE",
      icon: "bxs:trash",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout", {
        withCredentials: true,
      });

      if (res.status === 200) {
        logout();
        router.push("/");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-none">
          <Icon icon="material-symbols:menu-rounded" width="24" height="24" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        {/* Header with Logo */}
        <SheetHeader className="items-center mt-6 flex flex-col gap-2">
          <div className="w-28 h-28 overflow-hidden rounded-full border-2 border-[#0091ff]">
            <Image
              src="/icon.png"
              alt="Admin Logo"
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
          <div className="text-center mt-2">
            <SheetTitle className="font-bold text-2xl">ADMIN</SheetTitle>
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