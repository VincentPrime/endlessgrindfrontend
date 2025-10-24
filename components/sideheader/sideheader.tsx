"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Home,
  IdCard,
  Info,
  Phone,
  UserRound,
  LogIn,
} from "lucide-react";

export function Sideheader() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/membership", label: "MEMBERSHIP", icon: IdCard },
    { href: "/coaches", label: "COACHES", icon: UserRound },
    { href: "/about", label: "ABOUT", icon: Info },
    { href: "/contact", label: "CONTACT", icon: Phone },
    { href: "/auth/login", label: "LOGIN", icon: LogIn },
  ];

  return (
    <Sheet>
      {/* Menu Button */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent hover:bg-transparent border-none px-0"
        >
          <Icon
            icon="ic:round-menu"
            width="32"
            height="32"
            className="text-white"
          />
        </Button>
      </SheetTrigger>

      {/* Sidebar Content */}
      <SheetContent
        side="right"
        className="bg-black border-l border-l-gray-800 text-white flex flex-col"
      >
        <SheetHeader className="pb-4 border-b border-gray-700">
          <SheetTitle className="text-xl font-bold text-amber-400">
            Endless Grind
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col mt-6 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComp = item.icon;

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 text-lg px-3 py-2 rounded-md transition-all ${
                    isActive
                      ? "text-amber-400 bg-gray-800"
                      : "text-gray-300 hover:text-amber-400 hover:bg-gray-800/60"
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Endless Grind
        </div>
      </SheetContent>
    </Sheet>
  );
}