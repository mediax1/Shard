"use client";

import React from "react";
import { Check, X, Zap } from "lucide-react";

const plans = [
  {
    title: "Starter Pack",
    price: "$1",
    description: "100 credits",
    amount: 100,
    priceUsd: 1,
    planId: "starter",
    features: [
      { name: "Host Your Discord Bots", included: true },
      { name: "Premium Support", included: false },
      { name: "Premium Node", included: false }
    ]
  },
  {
    title: "Classic Pack",
    price: "$3",
    description: "300 credits (+50 bonus)",
    amount: 300,
    priceUsd: 3,
    planId: "classic",
    isPro: true,
    features: [
      { name: "Host Your Discord Bots", included: true },
      { name: "Premium Support", included: true },
      { name: "Premium Node", included: false }
    ]
  },
  {
    title: "Boost Pack",
    price: "$5",
    description: "500 credits (+100 bonus)",
    amount: 500,
    priceUsd: 5,
    planId: "boost",
    features: [
      { name: "Host Your Discord Bots", included: true },
      { name: "Premium Support", included: true },
      { name: "Premium Node", included: true }
    ]
  },
  {
    title: "Mega Pack",
    price: "$10",
    description: "1000 credits (+200 bonus)",
    amount: 1000,
    priceUsd: 10,
    planId: "mega",
    features: [
      { name: "Host Your Discord Bots", included: true },
      { name: "Premium Support", included: true },
      { name: "Premium Node", included: true }
    ]
  },
  {
    title: "Super Pack",
    price: "$20",
    description: "2000 credits (+400 bonus)",
    amount: 2000,
    priceUsd: 20,
    planId: "super",
    features: [
      { name: "Host Your Discord Bots", included: true },
      { name: "Premium Support", included: true },
      { name: "Premium Node", included: true }
    ]
  }
];

export default function PricingSection() {
  const handlePurchase = (planId: string) => {
    console.log(`Purchasing plan: ${planId}`);
    // Add purchase logic here (e.g., redirect to checkout)
  };

  return (
    <div className="w-full flex flex-col items-center py-4 sm:py-6 font-sans selection:bg-[#FFB800] selection:text-black">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 uppercase">
          Credit <span className="text-[#FFB800]">Packs</span>
        </h2>
        <p className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
          Boost your balance and keep your bots running
        </p>
      </div>

      {/* Grid container for 5 cards */}
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

            {/* Top Section */}
            <div className={`rounded-[1.75rem] p-5 pb-10 flex flex-col relative h-[150px] overflow-hidden ${
              plan.isPro ? "bg-gradient-to-br from-[#FFB800]/10 to-[#1a1a1a]" : "bg-[#1a1a1a]"
            }`}>
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-3 block">
                {plan.title}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-white">{plan.price}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-1 leading-tight">
                {plan.description}
              </p>
              
              {/* Subtle background icon/decor */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white">
                <Zap size={100} strokeWidth={1} />
              </div>
            </div>

            {/* Action Button */}
            <div className="relative -mt-6 px-3">
              <button
                onClick={() => handlePurchase(plan.planId)}
                className={`w-full py-2.5 rounded-xl text-[11px] font-black transition-all active:scale-95 uppercase tracking-wider shadow-xl ${
                  plan.isPro
                    ? "bg-[#FFB800] text-black hover:bg-[#e5a600]"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Purchase
              </button>
            </div>

            {/* Features List */}
            <div className="px-5 pt-7 pb-5 flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                      feature.included 
                        ? "bg-[#FFB800]/10 border-[#FFB800]/20" 
                        : "bg-white/5 border-white/5 opacity-30"
                    }`}>
                      {feature.included ? (
                        <Check size={10} className="text-[#FFB800]" />
                      ) : (
                        <X size={10} className="text-gray-500" />
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold tracking-tight ${
                      feature.included ? "text-gray-300" : "text-gray-600 line-through decoration-white/10"
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Footer */}
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
            Facing payment issues? Contact <span className="text-[#FFB800]">Admin</span> for support
          </p>
        </div>
      </div>
    </div>
  );
}
