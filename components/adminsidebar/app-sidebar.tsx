"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,

} from "@/components/ui/sidebar"
import Image from "next/image"
import { Icon } from "@iconify-icon/react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname,useRouter } from "next/navigation"
import axios from "axios";
import { useUser } from "@/context/AuthContext";

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter();
  const {  logout } = useUser();

  const navItems = [
    { href: "/Admin/dashboard", label: "DASHBOARD", icon: "material-symbols-light:dashboard-rounded" },
    { href: "/Admin/coaches", label: "LIST OF COACHES", icon: "mdi:whistle" },
    { href: "/Admin/users", label: "LIST OF USERS", icon: "material-symbols:person-rounded" },
    { href: "/Admin/schedule", label: "SCHEDULE", icon: "uis:schedule" },
    { href: "/Admin/package", label: "PROMOS/PACKAGE", icon: "mdi:package" },
    { href: "/Admin/applicationnotice", label: "APPLICATION NOTICE", icon: "ri:megaphone-fill" },
    { href: "/Admin/archive", label: "ARCHIVE", icon: "bxs:trash"  },
  ]
  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout", { withCredentials: true });

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
    <Sidebar className="py-4 pl-6">
      <SidebarHeader className="items-center mt-10">
        <div className="w-50 h-50 overflow-hidden rounded-full border-2 border-[#0091ff]">
          <Image
            src={"/icon.png"}
            alt="vincent"
            width={500}
            height={500}
          />
        </div>
      </SidebarHeader>

      <div className="text-center">
        <h1 className="font-bold text-2xl">ADMIN</h1>
      </div>

      <div className="px-10">
        <Separator className="my-4" />
      </div>

      <SidebarContent className="px-5 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={`flex justify-start gap-2  ${
                isActive ? "bg-primary/90 text-white" : "hover:bg-primary/20"
              }`}
            >
              <Link href={item.href}>
                <Icon icon={item.icon} width="24" height="24" />
                {item.label}
              </Link>
            </Button>
          )
        })}

       
      </SidebarContent>
       <Button onClick={handleLogout} className="mx-5 mb-2">
              Log out
            </Button>
    </Sidebar>
  )
}
