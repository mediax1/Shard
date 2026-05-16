"use client";

import React from "react";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    title: "Starter Pack",
    price: "$1",
    baseCredits: 80,
    bonusCredits: 0,
    totalCredits: 80,
    planId: "starter",
    isPro: false,
    perks: [
      "Standard Node Access",
      "Standard Support",
      "Bot Hosting Access"
    ]
  },
  {
    title: "Classic Pack",
    price: "$3",
    baseCredits: 250,
    bonusCredits: 20,
    totalCredits: 270,
    planId: "classic",
    isPro: true,
    perks: [
      "Priority Node Access",
      "Faster Deployment",
      "Standard Support"
    ]
  },
  {
    title: "Boost Pack",
    price: "$5",
    baseCredits: 450,
    bonusCredits: 50,
    totalCredits: 500,
    planId: "boost",
    isPro: false,
    perks: [
      "Priority Node Access",
      "Faster Deployment",
      "Priority Support"
    ]
  },
  {
    title: "Mega Pack",
    price: "$10",
    baseCredits: 950,
    bonusCredits: 100,
    totalCredits: 1050,
    planId: "mega",
    isPro: false,
    perks: [
      "Premium Node Access",
      "Fast Deployment",
      "Premium Support"
    ]
  },
  {
    title: "Super Pack",
    price: "$20",
    baseCredits: 2000,
    bonusCredits: 250,
    totalCredits: 2250,
    planId: "super",
    isPro: false,
    perks: [
      "Premium Node Access",
      "Highest Deployment Priority",
      "Fastest Support Response",
      "VIP Priority Access"
    ]
  }
];

export default function PricingSection() {
  const handlePurchase = (_planId: string) => {
    window.open("https://discord.gg/wgXgZ4BfbH", "_blank");
  };

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
          <div
            key={plan.planId}
            className={`group relative flex flex-col bg-[#111] border rounded-[2rem] p-1.5 transition-all duration-300 hover:scale-[1.02] ${
              plan.isPro
                ? "border-[#FFB800]/40 shadow-[0_0_40px_rgba(255,184,0,0.1)]"
                : "border-white/5 hover:border-white/10 hover:shadow-2xl"
            }`}
          >
            {plan.isPro && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-[#FFB800] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Popular
                </div>
              </div>
            )}

            <div className={`rounded-[1.75rem] p-5 pb-10 flex flex-col relative overflow-hidden ${
              plan.isPro ? "bg-gradient-to-br from-[#FFB800]/10 to-[#1a1a1a]" : "bg-[#1a1a1a]"
            }`}>
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-3 block">
                {plan.title}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-white">{plan.price}</span>
              </div>

              <div className="mt-2 space-y-0.5">
                <p className="text-[10px] text-gray-400 font-bold leading-tight">
                  {plan.baseCredits.toLocaleString()} Credits
                </p>
                {plan.bonusCredits > 0 && (
                  <p className="text-[10px] text-[#FFB800] font-bold leading-tight">
                    +{plan.bonusCredits} Bonus Credits
                  </p>
                )}
                {plan.bonusCredits > 0 && (
                  <p className="text-[10px] text-gray-300 font-black leading-tight">
                    Total: {plan.totalCredits.toLocaleString()} Credits
                  </p>
                )}
              </div>

              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white">
                <Zap size={100} strokeWidth={1} />
              </div>
            </div>

            <div className="relative -mt-6 px-3">
              <button
                onClick={() => handlePurchase(plan.planId)}
                className={`w-full py-2.5 rounded-xl text-[11px] font-black transition-all active:scale-95 uppercase tracking-wider shadow-xl ${
                  plan.isPro
                    ? "bg-[#FFB800] text-black hover:bg-[#e5a600]"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Open Ticket
              </button>
            </div>

            <div className="px-5 pt-7 pb-5 flex-grow">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">Perks</p>
              <ul className="space-y-3">
                {plan.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                      plan.isPro
                        ? "bg-[#FFB800]/10 border-[#FFB800]/20"
                        : "bg-white/5 border-white/10"
                    }`}>
                      <Check size={10} className={plan.isPro ? "text-[#FFB800]" : "text-gray-400"} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight text-gray-300">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 w-full flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Instant Delivery</span>
          </div>
        </div>

        <div className="mt-6 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5 opacity-40 hover:opacity-60 transition-opacity">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-center">
            Payments are manual — open a ticket in our <span className="text-[#FFB800]">Discord</span> to purchase credits
          </p>
        </div>
      </div>
    </div>
  );
}