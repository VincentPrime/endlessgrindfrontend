import Image from "next/image";
import { Icon } from "@iconify-icon/react";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white py-20 px-8 md:px-130 border-t border-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left side: Logo + Brand */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 md:h-20 md:w-20">
            <Image
              src="/icon.png"
              alt="Endless Grind Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Endless Grind</h1>
        </div>

        {/* Divider line */}
        <div className="hidden md:block w-px h-16 bg-gray-600" />

        {/* Right side: Socials + Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <span>Follow us :</span>
            <div className="flex gap-3 text-lg">
              <Icon icon="mdi:instagram" />
              <Icon icon="mdi:twitter" />
              <Icon icon="mdi:facebook" />
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Copyright © Endless Grind 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
