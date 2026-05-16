"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS as SHARED_PLANS, PLAN_DISPLAY, type PlanKey } from "@/lib/plans";

const PLAN_UI: { key: PlanKey; badge: string | null; color: string }[] = [
  { key: "starter",  badge: null,            color: "border-white/10"      },
  { key: "standard", badge: "⭐ Most Popular", color: "border-indigo-500/60" },
  { key: "pro",      badge: null,            color: "border-white/10"      },
  { key: "power",    badge: null,            color: "border-white/10"      },
];

const PLANS = PLAN_UI.map((ui) => ({
  ...ui,
  name:         SHARED_PLANS[ui.key].name,
  ram:          PLAN_DISPLAY[ui.key].ram,
  cpu:          PLAN_DISPLAY[ui.key].cpu,
  storage:      PLAN_DISPLAY[ui.key].storage,
  price7:       SHARED_PLANS[ui.key].price7,
  price30:      SHARED_PLANS[ui.key].price30,
  disabled:     SHARED_PLANS[ui.key].disabled ?? false,
  disabledLabel: SHARED_PLANS[ui.key].disabledLabel ?? null,
}));

export default function CreateServerPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [language, setLanguage] = useState<"nodejs" | "python">("python");
  const [plan, setPlan]         = useState("starter");
  const [duration, setDuration] = useState<7 | 30>(7);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const selectedPlan = PLANS.find((p) => p.key === plan)!;
  const cost = duration === 7 ? selectedPlan.price7 : selectedPlan.price30;

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Server name is required."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/servers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), language, plan, duration }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError("Server error. Please try again.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        router.push("/panel");
      } else {
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:h-full flex flex-col pb-8 md:pb-0">
      <div className="shrink-0 mb-3 md:mb-2">
        <h1 className="text-white text-2xl md:text-xl lg:text-2xl font-black tracking-tight">Create Server</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-xs font-medium">Deploy a new high-performance bot server.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col group/card hover:border-[#FFB800]/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none group-hover/card:bg-[#FFB800]/10 transition-all duration-700" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FFB800]/3 blur-[80px] rounded-full pointer-events-none group-hover/card:bg-[#FFB800]/8 transition-all duration-700" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 group-hover/card:opacity-60 transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="createDotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="0.8" fill="#FFB800" opacity="0.15" />
              </pattern>
              <radialGradient id="createDotMask" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="createFadeMask">
                <rect width="100%" height="100%" fill="url(#createDotMask)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#createDotGrid)" mask="url(#createFadeMask)" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] group-hover/card:opacity-[0.08] transition-opacity duration-700">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <path d="M20,50 L80,50 L80,30 L150,30" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M300,20 L350,20 L350,60 L380,60" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M30,250 L60,250 L60,220 L120,220" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M320,260 L360,260 L360,230 L390,230" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="50" r="2.5" fill="#FFB800" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="30" r="2.5" fill="#FFB800" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="350" cy="20" r="2" fill="#FFB800" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="250" r="2" fill="#FFB800" opacity="0.35">
              <animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="flex flex-col gap-4 md:gap-3 lg:gap-4 relative z-10 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Server Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-discord-bot"
                maxLength={32}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 md:py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FFB800]/50 transition-colors shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Language</label>
              <div className="flex gap-3">
                {(["python", "nodejs"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 py-2.5 md:py-2 rounded-xl border text-sm font-bold transition-all duration-200 ${
                      language === lang
                        ? "border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                        : "border-white/10 bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {lang === "nodejs" ? "Node.js" : "Python"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Plan</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-2 lg:gap-3">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => !p.disabled && setPlan(p.key)}
                  disabled={p.disabled}
                  className={`relative text-left p-4 md:p-3 lg:p-4 rounded-xl border transition-all duration-300 overflow-hidden group/plan ${
                    p.disabled
                      ? "border-white/5 bg-[#151515] opacity-50 cursor-not-allowed"
                      : plan === p.key
                        ? "border-[#FFB800] bg-[#FFB800]/5 shadow-[0_0_20px_rgba(255,184,0,0.1)]"
                        : "border-white/10 bg-[#1a1a1a] hover:border-[#FFB800]/40 hover:shadow-[0_0_15px_rgba(255,184,0,0.05)]"
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] pointer-events-none transition-all duration-500 ${!p.disabled && plan === p.key ? "bg-[#FFB800]/15" : "bg-transparent"}`} />

                  {p.badge && !p.disabled && (
                    <span className="absolute top-3 right-3 md:top-2 md:right-2 text-[10px] md:text-[9px] text-[#FFB800] font-bold bg-[#FFB800]/10 px-2 py-0.5 rounded-full">{p.badge}</span>
                  )}

                  {p.disabled && p.disabledLabel && (
                    <span className="absolute top-3 right-3 md:top-2 md:right-2 text-[10px] md:text-[9px] text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded-full">{p.disabledLabel}</span>
                  )}

                  <p className={`font-black text-base md:text-sm mb-1.5 md:mb-1 relative z-10 ${p.disabled ? "text-gray-600" : "text-white"}`}>{p.name}</p>
                  <div className="space-y-0.5 text-xs md:text-[11px] text-gray-500 font-medium relative z-10">
                    <p>RAM: <span className={`font-bold ${p.disabled ? "text-gray-600" : "text-gray-300"}`}>{p.ram}</span></p>
                    <p>CPU: <span className={`font-bold ${p.disabled ? "text-gray-600" : "text-gray-300"}`}>{p.cpu}</span></p>
                    <p>Storage: <span className={`font-bold ${p.disabled ? "text-gray-600" : "text-gray-300"}`}>{p.storage}</span></p>
                  </div>
                  <div className="mt-2 md:mt-1.5 pt-2 md:pt-1.5 border-t border-white/5 text-xs md:text-[11px] text-gray-500 font-medium flex items-center justify-between relative z-10">
                    <span>
                      <span className={`font-black text-sm md:text-xs ${p.disabled ? "text-gray-600" : "text-[#FFB800]"}`}>{p.price7} credits</span> / 7d
                    </span>
                    <span>
                      <span className={`font-black text-sm md:text-xs ${p.disabled ? "text-gray-600" : "text-[#FFB800]"}`}>{p.price30} credits</span> / 30d
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Duration</label>
            <div className="flex gap-3">
              {([7, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 md:py-2 rounded-xl border text-sm font-bold transition-all duration-200 ${
                    duration === d
                      ? "border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                      : "border-white/10 bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-medium p-3 bg-red-400/10 border border-red-400/20 rounded-lg">{error}</p>}

          <div className="hidden md:flex flex-1 items-center justify-center my-1">
            <svg viewBox="0 0 320 100" className="w-full max-w-[400px] lg:max-w-[350px] opacity-50 group-hover/card:opacity-70 transition-opacity duration-500">
              <rect x="135" y="15" width="50" height="70" rx="4" fill="#1a1a1a" stroke="#FFB800" strokeWidth="1" opacity="0.6" />
              <rect x="135" y="15" width="50" height="70" rx="4" fill="none" stroke="#FFB800" strokeWidth="1.2" opacity="0.4" />
              <rect x="141" y="22" width="38" height="8" rx="2" fill="#141414" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />
              <rect x="141" y="34" width="38" height="8" rx="2" fill="#141414" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />
              <rect x="141" y="46" width="38" height="8" rx="2" fill="#141414" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />
              <rect x="141" y="58" width="38" height="8" rx="2" fill="#141414" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />
              <rect x="141" y="70" width="38" height="8" rx="2" fill="#141414" stroke="#FFB800" strokeWidth="0.5" opacity="0.5" />
              <circle cx="145" cy="26" r="1.5" fill="#00FF88" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="145" cy="38" r="1.5" fill="#00FF88" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="145" cy="50" r="1.5" fill="#FFB800" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="145" cy="62" r="1.5" fill="#00FF88" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="145" cy="74" r="1.5" fill="#FFB800" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <path d="M30,30 L60,30 L60,45 L90,45" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" />
              <path d="M20,55 L50,55 L50,50 L90,50" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.25" />
              <path d="M40,75 L70,75 L70,55 L90,55" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.2" />
              <circle cx="30" cy="30" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle cx="20" cy="55" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle cx="40" cy="75" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle r="1.5" fill="#FFB800" opacity="0.7">
                <animateMotion dur="3s" repeatCount="indefinite" path="M30,30 L60,30 L60,45 L135,45" />
                <animate attributeName="opacity" values="0;0.7;0.7;0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#FFB800" opacity="0.6">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M20,55 L50,55 L50,50 L135,50" />
                <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#FFB800" opacity="0.5">
                <animateMotion dur="4s" repeatCount="indefinite" path="M40,75 L70,75 L70,55 L135,55" />
                <animate attributeName="opacity" values="0;0.5;0.5;0" dur="4s" repeatCount="indefinite" />
              </circle>
              <path d="M185,45 L230,45 L230,30 L280,30" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.3" />
              <path d="M185,50 L220,50 L220,55 L270,55" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.25" />
              <path d="M185,55 L230,55 L230,75 L290,75" stroke="#FFB800" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.2" />
              <circle cx="280" cy="30" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle cx="270" cy="55" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle cx="290" cy="75" r="3" fill="#1a1a1a" stroke="#FFB800" strokeWidth="0.8" opacity="0.4" />
              <circle r="1.5" fill="#00FF88" opacity="0.7">
                <animateMotion dur="3s" repeatCount="indefinite" path="M185,45 L230,45 L230,30 L280,30" />
                <animate attributeName="opacity" values="0;0.7;0.7;0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#00FF88" opacity="0.6">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M185,50 L220,50 L220,55 L270,55" />
                <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#00FF88" opacity="0.5">
                <animateMotion dur="4s" repeatCount="indefinite" path="M185,55 L230,55 L230,75 L290,75" />
                <animate attributeName="opacity" values="0;0.5;0.5;0" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="50" r="30" fill="none" stroke="#FFB800" strokeWidth="0.5" opacity="0.15">
                <animate attributeName="r" values="30;45;30" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.03;0.15" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="50" r="40" fill="none" stroke="#FFB800" strokeWidth="0.3" opacity="0.08">
                <animate attributeName="r" values="40;55;40" dur="5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.08;0.02;0.08" dur="5s" repeatCount="indefinite" />
              </circle>
              <text x="160" y="95" textAnchor="middle" fontSize="7" fill="#FFB800" opacity="0.25" fontWeight="600">DEPLOYING</text>
            </svg>
          </div>

          <div className="flex items-center justify-between pt-3 md:pt-2 border-t border-white/5 mt-auto">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Cost</p>
              <p className="text-white text-xl md:text-lg font-black">{cost} <span className="text-sm font-semibold text-gray-400">credits</span></p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="px-8 md:px-6 py-3 md:py-2.5 bg-[#FFB800] hover:bg-[#E5A500] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-black rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(255,184,0,0.25)] hover:shadow-[0_0_25px_rgba(255,184,0,0.4)]"
            >
              {loading ? "Creating..." : "Deploy Server"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}