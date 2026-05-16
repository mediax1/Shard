"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex items-center gap-6 sm:gap-10 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#0a0a0a]/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all hover:bg-[#0a0a0a]/60 hover:border-white/20">
        <div className="flex items-center shrink-0">
          <Link href="/">
            <img src="/images/DB.svg" alt="DB Logo" className="w-14 sm:w-16 h-auto object-contain cursor-pointer brightness-110" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-normal tracking-wide">
          <Link href="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
          <Link href="/tos" className="text-white/50 hover:text-white transition-colors">TOS</Link>
          <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy</Link>
          <Link href="/contact" className="text-white/50 hover:text-white transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-5 py-1.5 bg-[#FFB800] hover:bg-[#E5A500] text-black text-[12px] font-bold rounded-full transition-all active:scale-95 shadow-[0_0_12px_rgba(255,184,0,0.15)]">
            Start For Free
          </Link>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white/70 p-1 hover:bg-white/5 rounded-full transition-colors">
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile/Tablet Overlay Menu */}
        {isMenuOpen && (
          <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[180px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl flex flex-col gap-1 z-50 md:hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white/70 text-xs font-medium hover:text-[#FFB800] hover:bg-white/5 px-3 py-2 rounded-lg transition-all">Home</Link>
            <Link href="/tos" onClick={() => setIsMenuOpen(false)} className="text-white/70 text-xs font-medium hover:text-[#FFB800] hover:bg-white/5 px-3 py-2 rounded-lg transition-all">TOS</Link>
            <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="text-white/70 text-xs font-medium hover:text-[#FFB800] hover:bg-white/5 px-3 py-2 rounded-lg transition-all">Privacy</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-white/70 text-xs font-medium hover:text-[#FFB800] hover:bg-white/5 px-3 py-2 rounded-lg transition-all">Contact</Link>
          </div>
        )}
      </header>
    </div>
  );
}
