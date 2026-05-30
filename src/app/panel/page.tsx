import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import type { Server } from "@/lib/plans";

export default async function PanelPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let credits = 0;
  let servers: Server[] = [];

  try {
    const db = (await clientPromise).db();
    const record = await db.collection("users").findOne(
      { discordId: user.id },
      { projection: { credits: 1, servers: 1 } }
    );
    credits = record?.credits ?? 0;
    servers = (record?.servers ?? []).map((s: Record<string, unknown>) => ({
      ...s,
      expiresAt: new Date(s.expiresAt as Date).toISOString(),
      createdAt: new Date(s.createdAt as Date).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to connect to MongoDB, using default data for UI.");
  }

  const activeCount = servers.filter((s: { status: string }) => s.status !== "deleted").length;

  return (
    <div className="md:h-full flex flex-col pb-8 md:pb-0">
      <div className="shrink-0 mb-3 md:mb-2">
        <h1 className="text-white text-2xl md:text-xl lg:text-2xl font-black tracking-tight">Overview</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-xs font-medium">Welcome back, check your stats and manage your servers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-3 lg:gap-4 flex-1 md:max-h-[55%] lg:max-h-[60%]">

        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#FFB800]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#FFB800]/20 transition-all duration-500" />
          <div>
            <div className="flex items-center justify-between mb-3 md:mb-2">
              <div className="w-9 h-9 md:w-8 md:h-8 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[#FFB800] text-xs font-bold px-2 py-0.5 bg-[#FFB800]/10 rounded-full">Balance</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Available Credits</p>
            <h2 className="text-white text-4xl md:text-3xl lg:text-4xl font-black tracking-tight">{credits}</h2>
          </div>

          {/* Credits visual */}
          <div className="flex-1 flex items-center justify-center my-2 md:my-0">
            <svg viewBox="0 0 120 80" className="w-full max-w-[160px] md:max-w-[90px] lg:max-w-[120px] opacity-60 group-hover:opacity-80 transition-opacity duration-500">
              {/* Stacked credits */}
              <ellipse cx="60" cy="68" rx="38" ry="10" fill="#FFB800" opacity="0.15" />
              <ellipse cx="60" cy="62" rx="32" ry="8" fill="#FFB800" opacity="0.12" />
              {/* Bottom credit */}
              <ellipse cx="60" cy="55" rx="26" ry="7" fill="#1a1a1a" stroke="#FFB800" strokeWidth="1" opacity="0.8" />
              <ellipse cx="60" cy="53" rx="26" ry="7" fill="#1a1a1a" stroke="#FFB800" strokeWidth="1" opacity="0.9" />
              {/* Middle credit */}
              <ellipse cx="60" cy="44" rx="26" ry="7" fill="#1a1a1a" stroke="#FFB800" strokeWidth="1" opacity="0.9" />
              <ellipse cx="60" cy="42" rx="26" ry="7" fill="#181818" stroke="#FFB800" strokeWidth="1.2" />
              {/* Top credit */}
              <ellipse cx="60" cy="33" rx="26" ry="7" fill="#1a1a1a" stroke="#FFB800" strokeWidth="1" />
              <ellipse cx="60" cy="31" rx="26" ry="7" fill="#141414" stroke="#FFB800" strokeWidth="1.5" />
              {/* Dollar sign on top credit */}
              <text x="60" y="34" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="800" fill="#FFB800" opacity="0.7">$</text>
              {/* Sparkle effects */}
              <circle cx="28" cy="25" r="1.5" fill="#FFB800" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="92" cy="20" r="1" fill="#FFB800" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="85" cy="38" r="1.2" fill="#FFB800" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="35" cy="42" r="0.8" fill="#FFB800" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="mt-auto">
            <Link href="/panel/earn" className="block w-full text-center bg-[#FFB800] hover:bg-[#E5A500] text-black font-bold py-2.5 md:py-2 rounded-xl transition-colors shadow-[0_0_15px_rgba(255,184,0,0.2)] text-sm">
              Earn More
            </Link>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3 md:mb-2">
              <div className="w-9 h-9 md:w-8 md:h-8 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-bold px-2 py-0.5 bg-white/5 rounded-full">Network</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Servers</p>
            <h2 className="text-white text-4xl md:text-3xl lg:text-4xl font-black tracking-tight">{activeCount}</h2>

          </div>

          {/* Activity graph visual */}
          <div className="flex-1 flex items-end justify-center my-2 md:my-0 px-1">
            <svg viewBox="0 0 180 70" className="w-full max-w-[200px] md:max-w-[130px] lg:max-w-[160px] lg:mb-12 opacity-50 group-hover:opacity-70 transition-opacity duration-500">
              {/* Grid lines */}
              <line x1="10" y1="15" x2="170" y2="15" stroke="white" strokeWidth="0.3" opacity="0.1" />
              <line x1="10" y1="30" x2="170" y2="30" stroke="white" strokeWidth="0.3" opacity="0.1" />
              <line x1="10" y1="45" x2="170" y2="45" stroke="white" strokeWidth="0.3" opacity="0.1" />
              <line x1="10" y1="60" x2="170" y2="60" stroke="white" strokeWidth="0.3" opacity="0.15" />

              {/* Bar chart */}
              <rect x="16" y="42" width="14" height="18" rx="3" fill="white" opacity="0.08" />
              <rect x="36" y="32" width="14" height="28" rx="3" fill="white" opacity="0.1" />
              <rect x="56" y="38" width="14" height="22" rx="3" fill="white" opacity="0.08" />
              <rect x="76" y="25" width="14" height="35" rx="3" fill="white" opacity="0.12" />
              <rect x="96" y="18" width="14" height="42" rx="3" fill="white" opacity="0.1" />
              <rect x="116" y="28" width="14" height="32" rx="3" fill="white" opacity="0.15" />
              <rect x="136" y="22" width="14" height="38" rx="3" fill="#FFB800" opacity="0.25" />
              <rect x="156" y="30" width="14" height="30" rx="3" fill="#FFB800" opacity="0.2" />

              {/* Trend line */}
              <polyline
                points="23,40 43,30 63,36 83,23 103,16 123,26 143,20 163,28"
                fill="none"
                stroke="#FFB800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
              {/* Trend line glow */}
              <polyline
                points="23,40 43,30 63,36 83,23 103,16 123,26 143,20 163,28"
                fill="none"
                stroke="#FFB800"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.1"
                filter="url(#glowFilter)"
              />
              {/* Active dot on latest point */}
              <circle cx="163" cy="28" r="3" fill="#FFB800" opacity="0.6">
                <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="163" cy="28" r="2" fill="#FFB800" opacity="0.8" />

              {/* Day labels */}
              <text x="23" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">M</text>
              <text x="43" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">T</text>
              <text x="63" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">W</text>
              <text x="83" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">T</text>
              <text x="103" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">F</text>
              <text x="123" y="69" textAnchor="middle" fontSize="6" fill="white" opacity="0.2">S</text>
              <text x="143" y="69" textAnchor="middle" fontSize="6" fill="#FFB800" opacity="0.4">S</text>
              <text x="163" y="69" textAnchor="middle" fontSize="6" fill="#FFB800" opacity="0.4">M</text>
            </svg>
          </div>

          <div className="mt-auto">
            <Link href="/panel/servers" className="block w-full text-center bg-[#1a1a1a] hover:bg-white/10 text-white font-bold py-2.5 md:py-2 rounded-xl transition-colors border border-white/5 text-sm">
              Manage Servers
            </Link>
          </div>
        </div>

        <Link href="/panel/create" className="bg-gradient-to-br from-[#111] to-[#FFB800]/10 border border-[#FFB800]/30 rounded-2xl p-4 md:p-4 lg:p-6 shadow-[0_0_30px_-15px_rgba(255,184,0,0.3)] relative overflow-hidden flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/70 hover:shadow-[0_0_40px_-10px_rgba(255,184,0,0.5)] transition-all duration-500">
          {/* Animated dot grid pattern background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="1" fill="#FFB800" opacity="0.12" />
                </pattern>
                <radialGradient id="dotMask" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <mask id="fadeMask">
                  <rect width="100%" height="100%" fill="url(#dotMask)" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" mask="url(#fadeMask)" />
            </svg>
            {/* Floating circuit lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
              <path d="M20,100 L60,100 L60,60 L100,60" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M100,60 L100,30 L140,30" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M140,30 L180,30 L180,80" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M60,140 L100,140 L100,170 L150,170" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M20,160 L40,160 L40,120 L80,120" stroke="#FFB800" strokeWidth="1" fill="none" strokeLinecap="round" />
              <circle cx="60" cy="100" r="2.5" fill="#FFB800" opacity="0.5" />
              <circle cx="100" cy="60" r="2.5" fill="#FFB800" opacity="0.5" />
              <circle cx="140" cy="30" r="2.5" fill="#FFB800" opacity="0.5" />
              <circle cx="180" cy="80" r="2.5" fill="#FFB800" opacity="0.5" />
              <circle cx="100" cy="140" r="2.5" fill="#FFB800" opacity="0.5" />
              <circle cx="150" cy="170" r="2.5" fill="#FFB800" opacity="0.5" />
              {/* Animated pulse on nodes */}
              <circle cx="100" cy="60" r="2.5" fill="#FFB800" opacity="0.4">
                <animate attributeName="r" values="2.5;5;2.5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="150" cy="170" r="2.5" fill="#FFB800" opacity="0.3">
                <animate attributeName="r" values="2.5;5;2.5" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#FFB800]/20 transition-all duration-500" />

          <div className="relative z-10 w-14 h-14 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center mb-3 md:mb-1 lg:mb-2 group-hover:scale-110 group-hover:bg-[#FFB800] group-hover:border-[#FFB800] transition-all duration-500 shadow-[0_0_15px_rgba(255,184,0,0.1)]">
            <svg className="w-7 h-7 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#FFB800] group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 className="relative z-10 text-white text-lg md:text-base font-bold mb-1">Create New Server</h3>
          <p className="relative z-10 text-gray-400 text-sm md:text-xs font-medium px-4">Deploy a new Discord bot in seconds.</p>
        </Link>

      </div>
    </div>
  );
}