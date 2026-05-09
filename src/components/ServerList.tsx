"use client";

import { useState, useEffect } from "react";
import { PLAN_COLORS, PLAN_DISPLAY, PLANS, type PlanKey, type Server } from "@/lib/plans";
import { isModerationBlocked, isRenewable } from "@/lib/serverUtils";

function LiveTimer({ expiresAt }: { expiresAt: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("Expired");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setDisplay(`${d}d ${h}h ${m}m ${s}s`);
      else setDisplay(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  return <span>{display}</span>;
}

function GraceTimer({ graceEndsAt }: { graceEndsAt: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(graceEndsAt).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("Grace period ended");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setDisplay(`${d}d ${h}h ${m}m ${s}s`);
      else setDisplay(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [graceEndsAt]);

  return <span>{display}</span>;
}

function RenewModal({ server, onClose, onRenewed }: {
  server: Server;
  onClose: () => void;
  onRenewed: (newExpiry: string, creditsLeft: number) => void;
}) {
  const [duration, setDuration] = useState<7 | 30>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planData = PLANS[server.plan as PlanKey] || { price7: 0, price30: 0 };
  const cost = duration === 7 ? planData.price7 : planData.price30;

  const handleRenew = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/servers/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId: server.id, duration }),
      });
      const data = await res.json();
      if (res.ok) {
        onRenewed(data.newExpiry, data.creditsLeft);
        onClose();
      } else {
        setError(data.error || "Failed to renew");
      }
    } catch {
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-5">
        <div>
          <h3 className="text-white font-bold text-base">Renew Server</h3>
          <p className="text-gray-500 text-xs mt-1">{server.name}</p>
          {server.status === "suspended" && (
            <p className="text-amber-400 text-xs mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              Server is suspended. Renewing will restore it immediately.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-widest">Duration</p>
          <div className="flex gap-3">
            {([7, 30] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  duration === d
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div className="flex items-center justify-between pt-1">
          <p className="text-gray-500 text-sm">Cost: <span className="text-white font-bold">{cost} credits</span></p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
              Cancel
            </button>
            <button
              onClick={handleRenew}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? "Renewing..." : "Renew"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServerList({
  initialServers,
  pterodactylUrl,
  pteroEmail,
  pteroPassword,
}: {
  initialServers: Server[];
  pterodactylUrl: string;
  pteroEmail: string | null;
  pteroPassword: string | null;
}) {
  const [servers, setServers] = useState(initialServers);
  const [renewingServer, setRenewingServer] = useState<Server | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleRenewed = (serverId: string, newExpiry: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? { ...s, expiresAt: newExpiry, status: "active", suspendedAt: undefined, graceEndsAt: undefined }
          : s
      )
    );
  };

  const handleDelete = async (serverId: string) => {
    setDeletingId(serverId);
    const res = await fetch("/api/servers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId }),
    });
    if (res.ok) {
      setServers((prev) => prev.map((s) => (s.id === serverId ? { ...s, status: "deleted" } : s)));
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const active = servers.filter((s) => s.status !== "deleted");

  return (
    <>
      {renewingServer && (
        <RenewModal
          server={renewingServer}
          onClose={() => setRenewingServer(null)}
          onRenewed={(newExpiry) => handleRenewed(renewingServer.id, newExpiry)}
        />
      )}

      {pteroEmail && pteroPassword && (
        <div className="mb-4 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl space-y-3">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Panel Login Credentials</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 w-16 shrink-0">Email</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-white font-mono truncate">{pteroEmail}</span>
              <button
                onClick={() => copyToClipboard(pteroEmail, "email")}
                className="shrink-0 text-[10px] text-gray-500 hover:text-white transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
              >
                {copiedEmail ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 w-16 shrink-0">Password</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-white font-mono truncate">{pteroPassword}</span>
              <button
                onClick={() => copyToClipboard(pteroPassword, "password")}
                className="shrink-0 text-[10px] text-gray-500 hover:text-white transition-colors px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
              >
                {copiedPassword ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <a
            href={pterodactylUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-full block text-center py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 text-xs font-medium rounded-lg transition-colors"
          >
            Open Panel →
          </a>
        </div>
      )}

      {active.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-xl p-10 text-center">
          <p className="text-gray-500 text-sm">No servers yet</p>
          <p className="text-gray-600 text-xs mt-1">Create your first server to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((server) => {
            const isSuspended = server.status === "suspended" && !isModerationBlocked(server);
            const isTOSSuspended = server.moderationStatus === "suspended";
            const expired = new Date(server.expiresAt).getTime() < Date.now();
            const specs = PLAN_DISPLAY[server.plan as PlanKey];
            const planColor = PLAN_COLORS[server.plan as PlanKey] || "text-gray-400";
            const isDeleting = deletingId === server.id;
            const confirmingDelete = confirmDeleteId === server.id;

            return (
              <div
                key={server.id}
                className={`bg-[#111111] border rounded-xl p-5 ${
                  isTOSSuspended ? "border-red-500/30" : isSuspended ? "border-amber-500/30" : "border-white/10"
                }`}
              >
                {isTOSSuspended && (
                  <div className="mb-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-xs font-medium">
                      Suspended for TOS violation — contact support to appeal.{" "}
                      {server.moderationReason && <span className="opacity-70">Reason: {server.moderationReason}</span>}
                    </p>
                  </div>
                )}
                {isSuspended && (
                  <div className="mb-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <p className="text-amber-400 text-xs font-medium">
                      Server suspended — renew before grace period ends to restore access
                    </p>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                      isTOSSuspended ? "bg-red-500" : isSuspended ? "bg-amber-400" : expired ? "bg-red-500" : "bg-green-400"
                    }`} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-semibold text-sm">{server.name}</p>
                        <span className={`text-xs font-medium capitalize ${planColor}`}>{server.plan}</span>
                        <span className="text-gray-600 text-xs">{server.language === "nodejs" ? "Node.js" : "Python"}</span>
                        {isTOSSuspended && (
                          <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                            TOS Suspended
                          </span>
                        )}
                        {isSuspended && (
                          <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Suspended
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span>{specs?.ram || "N/A"} RAM</span>
                        <span>·</span>
                        <span>{specs?.cpu || "N/A"} CPU</span>
                        <span>·</span>
                        <span>{specs?.storage || "N/A"} Disk</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!expired && !isSuspended && !isTOSSuspended && server.pteroUuid && (
                      <a
                        href={`${pterodactylUrl}/server/${server.pteroUuid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Manage
                      </a>
                    )}
                    {isRenewable(server) && (
                      <button
                        onClick={() => setRenewingServer(server)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                          isSuspended
                            ? "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-400"
                            : "bg-indigo-600/20 hover:bg-indigo-600/40 border-indigo-500/30 text-indigo-400"
                        }`}
                      >
                        Renew
                      </button>
                    )}
                    {!isTOSSuspended && (
                      <>
                        {confirmingDelete ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(server.id)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40"
                            >
                              {isDeleting ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1.5 text-gray-500 hover:text-white text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(server.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {!isTOSSuspended && (
                  <div className={`mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs ${
                    isSuspended ? "text-amber-500" : expired ? "text-red-400" : "text-gray-500"
                  }`}>
                    {isSuspended && server.graceEndsAt ? (
                      <>
                        <span>Grace period ends in</span>
                        <span className="font-mono text-amber-400">
                          <GraceTimer graceEndsAt={server.graceEndsAt} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{expired ? "Expired" : "Expires in"}</span>
                        <span className={`font-mono ${expired ? "text-red-400" : "text-gray-300"}`}>
                          <LiveTimer expiresAt={server.expiresAt} />
                        </span>
                      </>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}