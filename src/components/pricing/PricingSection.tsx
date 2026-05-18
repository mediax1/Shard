"use client";

import { plans } from "./PricingPlans";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  return (
    <div className="w-full flex flex-col items-center py-4 sm:py-6 font-sans selection:bg-[#FFB800] selection:text-black">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 uppercase">
          Credit <span className="text-[#FFB800]">Packs</span>
        </h2>
        <p className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
          Boost your balance and keep your bots running
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        {plans.map((plan) => (
          <PricingCard key={plan.planId} plan={plan} />
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 w-full flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Instant Delivery</span>
          </div>
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5 opacity-40 hover:opacity-60 transition-opacity">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">
            Prefer manual? Open a ticket in our <span className="text-[#FFB800]">Discord</span>
          </p>
        </div>
      </div>
    </div>
  );
}