"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-4 sm:px-10 md:px-16 py-3 sm:py-4 md:py-6 z-10 w-full flex-shrink-0 ">
      <div className="w-24 sm:w-20 md:w-24 lg:w-30 h-auto flex items-center justify-center pt-2 sm:pt-0 md:pt-8 ml-2 sm:ml-1 md:ml-0">
        <Link href="/">
          <img src="/images/DB.svg" alt="DB Logo" className="w-full h-auto object-contain cursor-pointer" />
        </Link>
      </div>
      <nav className="flex items-center gap-4 sm:gap-6 md:gap-10 text-sm sm:text-base md:text-lg font-thin pr-1 md:pr-2 md:pt-6">
        <Link href="/" className="hidden sm:block text-white hover:text-gray-300 transition">Home</Link>
        <Link href="/tos" className="hidden sm:block text-white hover:text-gray-300 transition">Terms of Service</Link>
        <Link href="/privacy" className="hidden sm:block text-white hover:text-gray-300 transition">Privacy Policy</Link>
         <Link href="/contact" className="hidden sm:block text-white hover:text-gray-300 transition">Contact Us</Link>
                 <Link href="/refund" className="hidden sm:block text-white hover:text-gray-300 transition">Refund Policy</Link>

        <Link href="/login" className="px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-[#FFB800] hover:bg-[#E5A500] text-black text-[13px] sm:text-sm md:text-base font-bold rounded-xl shadow-sm shadow-[#FFB800]/20 md:shadow-[0_0_15px_rgba(255,184,0,0.25)] hover:shadow-md transition-all duration-200 active:scale-95">Get Started</Link>
      </nav>
    </header>
  );
}