import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import ServerList from "@/components/ServerList";
import type { Server } from "@/lib/plans";
import { isDisplayActive } from "@/lib/serverUtils";


export default async function ServersPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  let servers: Server[] = [];
  let pteroEmail: string | null = null;
  let pteroPassword: string | null = null;

  try {
    const db = (await clientPromise).db();
    const record = await db.collection("users").findOne(
      { discordId: user.id },
      { projection: { servers: 1, pteroEmail: 1, pteroPassword: 1 } }
    );
    pteroEmail = record?.pteroEmail ?? null;
    pteroPassword = record?.pteroPassword ?? null;
    servers = (record?.servers ?? []).map((s: Record<string, unknown>) => ({
      ...s,
      expiresAt: new Date(s.expiresAt as Date).toISOString(),
      createdAt: new Date(s.createdAt as Date).toISOString(),
      graceEndsAt: s.graceEndsAt ? new Date(s.graceEndsAt as Date).toISOString() : undefined,
      suspendedAt: s.suspendedAt ? new Date(s.suspendedAt as Date).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("Failed to connect to MongoDB, using default data for UI.");
  }

  const activeCount = servers.filter(isDisplayActive).length;

  return (
    <div className="md:h-full flex flex-col pb-8 md:pb-0">
      <div className="shrink-0 mb-3 md:mb-2">
        <h1 className="text-white text-2xl md:text-xl lg:text-2xl font-black tracking-tight">Current Servers</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-xs font-medium">Manage your active and inactive servers.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-4 md:mb-3 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-8 md:h-8 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
              <svg className="w-5 h-5 md:w-4 md:h-4 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-base md:text-sm font-bold">Your Servers</h2>
              <p className="text-gray-500 text-xs md:text-[11px] font-semibold uppercase tracking-widest">{activeCount} ACTIVE</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
          <ServerList
            initialServers={servers}
            pterodactylUrl={process.env.PTERODACTYL_URL ?? ""}
            pteroEmail={pteroEmail}
            pteroPassword={pteroPassword}
          />
        </div>
      </div>
    </div>
  );
}