"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isVisible) {
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 md:left-[calc(50vw+128px)] -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="relative overflow-hidden rounded-[20px] bg-black/80 backdrop-blur-3xl border border-[#FFB800]/30 shadow-2xl transition-all duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/5 blur-[40px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFB800]/5 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="relative p-4 flex flex-row items-center justify-between gap-3 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,184,0,0.2)]">
              <Sparkles className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="text-white text-[15px] font-extrabold tracking-tight mb-0.5">Unlock Premium</h3>
              <p className="text-[#FFB800]/80 text-[10px] font-bold tracking-widest uppercase">Nodes & Credits</p>
            </div>
          </div>
          <Link href="/panel/pricings" className="shrink-0 bg-[#FFB800] hover:bg-[#E5A500] text-black font-bold py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-xs ml-auto">
            View Store
          </Link>
        </div>
      </div>
    </div>
  );
}
