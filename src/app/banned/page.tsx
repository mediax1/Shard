import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";

export const metadata = {
  title: "Account Banned | Shard",
  description: "Your account has been banned from accessing Shard services.",
};

export default async function BannedPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("token")?.value;
  let reason: string | null = null;

  if (!rawToken) redirect("/login");

  let discordId: string | null = null;
  try {
    const token = decodeURIComponent(rawToken);
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    discordId = payload?.id ?? null;
  } catch {
    redirect("/login");
  }

  if (!discordId) redirect("/login");

  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne(
    { discordId },
    { projection: { banned: 1, bannedReason: 1 } }
  );

  if (!record || record.banned !== true) redirect("/panel");

  reason = record.bannedReason ?? null;

  return (
    <div className="min-h-[100dvh] bg-transparent flex items-center justify-center relative overflow-hidden px-4 py-8 sm:py-12">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{ background: "radial-gradient(circle, #FFB800 0%, transparent 70%)", animation: "bannedPulse 4s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #cc9200 0%, transparent 70%)", animation: "bannedPulse 6s ease-in-out infinite reverse" }}
      />

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-4 sm:mb-6">
          <Link href="/">
            <img src="/images/DB.svg" alt="Shard Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(255,184,0,0.15)] cursor-pointer hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,184,0,0.06)] text-center">
          <div className="mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 sm:mb-6" style={{ animation: "bannedPulse 3s ease-in-out infinite" }}>
            <svg className="w-7 h-7 sm:w-10 sm:h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zm0 10.036h.008v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Access <span className="text-red-500">Banned</span>
          </h1>

          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mx-auto my-3 sm:my-5" />

          <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-2">
            Your account has been banned and you are no longer able to access Shard services.
          </p>

          {reason && (
            <div className="mt-3 sm:mt-4 mb-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3 sm:py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1.5">Reason</p>
              <p className="text-gray-300 text-xs sm:text-sm font-medium break-words">{reason}</p>
            </div>
          )}

          <p className="text-gray-500 text-[11px] sm:text-xs mt-4 sm:mt-5 mb-5 sm:mb-7 leading-relaxed">
            If you believe this is a mistake, please reach out to our support team on Discord to appeal your restriction.
          </p>

          <a
            href="https://discord.gg/wgXgZ4BfbH"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 hover:border-[#5865F2]/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(88,101,242,0.15) 0%, transparent 70%)" }} />
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5865F2] shrink-0 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
            <span className="text-[#5865F2] group-hover:text-white font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300">
              Contact Support on Discord
            </span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5865F2]/60 shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <p className="text-center text-gray-600 text-[10px] font-medium tracking-[0.3em] uppercase mt-4 sm:mt-6">
          Shard — Dynexus
        </p>
      </div>

      <style>{`
        @keyframes bannedPulse {
          0%, 100% { transform: scale(1); opacity: 0.07; }
          50% { transform: scale(1.15); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}