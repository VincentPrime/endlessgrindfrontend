"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  IdCard,
  Info,
  Phone,
  UserRound,
  LogIn,
} from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/membership", label: "MEMBERSHIP", icon: IdCard },
    { href: "/coaches", label: "COACHES", icon: UserRound },
    { href: "/about", label: "ABOUT", icon: Info },
    { href: "/contact", label: "CONTACT", icon: Phone },
    { href: "/auth/login", label: "LOGIN", icon: LogIn },

  ]

  return (
    <div className="flex gap-10">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={`flex items-center gap-2 bg-transparent hover:bg-transparent hover:text-none hover:border-b-2 hover:border-amber-400 rounded-none transition-all ease-in-out ${
              isActive ? "text-amber-400" : "text-white"
            }`}
          >
            <Link href={item.href}>
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
