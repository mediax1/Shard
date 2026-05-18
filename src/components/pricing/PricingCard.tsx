"use client";

import { Check, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { Plan } from "./PricingPlans";

export default function PricingCard({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false);

  const handleCryptoPay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong");
      }
    } catch {
      alert("Failed to create payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTicket = () => {
    window.open("https://discord.gg/wgXgZ4BfbH", "_blank");
  };

  return (
    <div
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

      <div
        className={`rounded-[1.75rem] p-5 pb-10 flex flex-col relative overflow-hidden ${
          plan.isPro ? "bg-gradient-to-br from-[#FFB800]/10 to-[#1a1a1a]" : "bg-[#1a1a1a]"
        }`}
      >
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
            <>
              <p className="text-[10px] text-[#FFB800] font-bold leading-tight">
                +{plan.bonusCredits} Bonus Credits
              </p>
              <p className="text-[10px] text-gray-300 font-black leading-tight">
                Total: {plan.totalCredits.toLocaleString()} Credits
              </p>
            </>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white">
          <Zap size={100} strokeWidth={1} />
        </div>
      </div>

      <div className="relative -mt-6 px-3 flex flex-col gap-2">
        <button
          onClick={handleCryptoPay}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl text-[11px] font-black transition-all active:scale-95 uppercase tracking-wider shadow-xl flex items-center justify-center gap-1.5 ${
            plan.isPro
              ? "bg-[#FFB800] text-black hover:bg-[#e5a600]"
              : "bg-white text-black hover:bg-gray-100"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : null}
          {loading ? "Creating..." : "Pay with Crypto"}
        </button>
        <button
          onClick={handleTicket}
          className="w-full py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 uppercase tracking-wider border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
        >
          Open Ticket
        </button>
      </div>

      <div className="px-5 pt-7 pb-5 flex-grow">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-3">Perks</p>
        <ul className="space-y-3">
          {plan.perks.map((perk, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                  plan.isPro
                    ? "bg-[#FFB800]/10 border-[#FFB800]/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <Check size={10} className={plan.isPro ? "text-[#FFB800]" : "text-gray-400"} />
              </div>
              <span className="text-[10px] font-semibold tracking-tight text-gray-300">{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}