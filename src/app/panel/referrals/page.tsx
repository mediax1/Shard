"use client";

import { useEffect, useState, useCallback } from "react";

type Referral = {
  username: string;
  createdAt: string;
};

type ReferralState = {
  referralCode: string | null;
  referralCount: number;
  referralEarnings: number;
  referrals: Referral[];
  referralLink: string | null;
};

export default function ReferralsPage() {
  const [state, setState] = useState<ReferralState | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/referrals");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setState(data);
    } catch {
      setError("Failed to load referral data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchState(); }, [fetchState]);

  const generateCode = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/referrals", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setState((prev) => prev ? { ...prev, referralCode: data.referralCode, referralLink: data.referralLink } : prev);
    } catch {
      setError("Failed to generate referral code.");
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (!state?.referralLink) return;
    navigator.clipboard.writeText(state.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-400 font-semibold">{error}</p>
        <button onClick={() => { setError(null); setLoading(true); fetchState(); }} className="px-5 py-2 rounded-full border border-[#FFB800]/40 text-[#FFB800] text-sm font-bold hover:bg-[#FFB800]/10 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="md:h-full flex flex-col pb-8 md:pb-0">
      <div className="shrink-0 mb-3 md:mb-2">
        <h1 className="text-white text-2xl md:text-xl lg:text-2xl font-black tracking-tight">Referrals</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-xs font-medium">Invite friends and earn credits for every signup.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 mb-4 md:mb-3">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-5 relative overflow-hidden group hover:border-[#FFB800]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/10 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Referrals</p>
          <h2 className="text-white text-3xl md:text-2xl lg:text-3xl font-black">{state?.referralCount ?? 0}</h2>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-5 relative overflow-hidden group hover:border-[#FFB800]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/10 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Credits Earned</p>
          <h2 className="text-white text-3xl md:text-2xl lg:text-3xl font-black">{state?.referralEarnings ?? 0}</h2>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-5 relative overflow-hidden group hover:border-[#FFB800]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/10 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Reward Per Referral</p>
          <h2 className="text-[#FFB800] text-3xl md:text-2xl lg:text-3xl font-black">+15</h2>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-4 lg:p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col group/card hover:border-[#FFB800]/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-white text-base md:text-sm font-bold mb-1">Your Referral Link</h2>
          <p className="text-gray-500 text-xs mb-4">Share this link with friends. They get +5 bonus credits on signup, you get +15 credits.</p>

          {state?.referralCode ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono truncate">
                {state.referralLink}
              </div>
              <button
                onClick={copyLink}
                className="px-6 py-3 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-black rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(255,184,0,0.25)] hover:shadow-[0_0_25px_rgba(255,184,0,0.4)] shrink-0"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          ) : (
            <button
              onClick={generateCode}
              disabled={generating}
              className="px-6 py-3 bg-[#FFB800] hover:bg-[#E5A500] disabled:opacity-40 text-black text-sm font-black rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(255,184,0,0.25)]"
            >
              {generating ? "Generating..." : "Generate Referral Link"}
            </button>
          )}
        </div>

        {state?.referrals && state.referrals.length > 0 && (
          <div className="relative z-10 mt-6 flex-1 overflow-y-auto">
            <h3 className="text-white text-sm font-bold mb-3">Recent Referrals</h3>
            <div className="space-y-2">
              {state.referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-semibold">{r.username}</span>
                  </div>
                  <span className="text-gray-500 text-xs font-medium">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state?.referrals && state.referrals.length === 0 && state.referralCode && (
          <div className="relative z-10 mt-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No referrals yet</p>
            <p className="text-gray-600 text-xs mt-1">Share your link to start earning credits</p>
          </div>
        )}
      </div>
    </div>
  );
}
