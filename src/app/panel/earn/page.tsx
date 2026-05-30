"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";


type State = {
  credits: number;
  claimsToday: number;
  dailyLimit: number;
  cooldownMs: number;
  captchaEvery: number;
  lastClaimAt: string | null;
  nextResetAt: string;
  totalSpins: number;
};

type MessageType = "success" | "error" | "tryagain";

const SEGMENTS = [
  { emoji: "\u{1FA99}", label: "+1",  color: "#18181b", type: "credit",     reward: 1  },
  { emoji: "\u{1FA99}", label: "+2",  color: "#27272a", type: "credit",     reward: 2  },
  { emoji: "\u{1FA99}", label: "+10", color: "#18181b", type: "credit",     reward: 10 },
  { emoji: null,        label: "",    color: "#27272a", type: "tryagain", reward: 0  },
];

const SLICE_DEG  = 360 / SEGMENTS.length;
const SPIN_MS    = 3500;
const WHEEL_SIZE = 300;
const R          = WHEEL_SIZE / 2 - 10;
const CX         = WHEEL_SIZE / 2;
const CY         = WHEEL_SIZE / 2;
const GAP        = 1;

const pad = (n: number) => String(n).padStart(2, "0");

function formatCooldown(seconds: number) {
  if (seconds >= 3600) {
    return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  }
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

function useCountdown(targetISO: string | null) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetISO) return;
    const update = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetISO]);

  return timeLeft;
}

function WheelSVG({ rotation, spinning, skipAnim }: { rotation: number; spinning: boolean; skipAnim: boolean }) {
  const slicePaths = SEGMENTS.map((seg, i) => {
    const a1 = ((i * SLICE_DEG) + GAP / 2 - 90) * Math.PI / 180;
    const a2 = (((i + 1) * SLICE_DEG) - GAP / 2 - 90) * Math.PI / 180;
    const x1 = CX + R * Math.cos(a1);
    const y1 = CY + R * Math.sin(a1);
    const x2 = CX + R * Math.cos(a2);
    const y2 = CY + R * Math.sin(a2);
    return (
      <path
        key={i}
        d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 0,1 ${x2},${y2} Z`}
        fill={seg.color}
      />
    );
  });

  const sliceContents = SEGMENTS.map((seg, i) => {
    const midAngle = ((i + 0.5) * SLICE_DEG - 90) * Math.PI / 180;
    const labelR   = R * 0.65;
    const tx       = CX + labelR * Math.cos(midAngle);
    const ty       = CY + labelR * Math.sin(midAngle);

    if (seg.type === "tryagain") {
      return (
        <g key={`c${i}`} transform={`translate(${tx}, ${ty})`}>
          <g transform="translate(-12, -18) scale(1.1)">
            <path
              d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              fill="#FFB800"
            />
          </g>
          <g transform="translate(12, 14)">
            <rect x="-28" y="-9" width="56" height="18" rx="9" fill="#FFB800" />
            <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#000">
              TRY AGAIN
            </text>
          </g>
        </g>
      );
    }

    return (
      <g key={`c${i}`} transform={`translate(${tx}, ${ty})`}>
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="38"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.8))" }}
        >
          {seg.emoji}
        </text>
        <g transform="translate(18, 16)">
          <rect x="-18" y="-11" width="36" height="22" rx="11" fill="#FFB800" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="900" fill="#000">
            {seg.label}
          </text>
        </g>
      </g>
    );
  });

  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="absolute inset-0 w-full h-full rounded-full"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: spinning && !skipAnim ? `transform ${SPIN_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : "none",
      }}
    >
      {slicePaths}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#333" strokeWidth="1" />
      {sliceContents}
    </svg>
  );
}

export default function EarnPage() {
  const [state, setState]               = useState<State | null>(null);
  const [fetchError, setFetchError]     = useState(false);
  const [loading, setLoading]           = useState(true);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [message, setMessage]           = useState<{ type: MessageType; text: string } | null>(null);
  const [showCaptcha, setShowCaptcha]   = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [claiming, setClaiming]         = useState(false);
  const [spinning, setSpinning]         = useState(false);
  const [skipAnim, setSkipAnim]         = useState(false);
  const [displayRotation, setDisplayRotation] = useState(0);

  const pendingResult = useRef<{
    credits: number;
    claimsToday: number;
    totalSpins: number;
    reward: number;
    rewardType: string;
    cooldownMs: number;
  } | null>(null);

  const captchaRef = useRef<HCaptcha>(null);
  const timeLeft   = useCountdown(state?.nextResetAt ?? null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/credits/claim");
      if (!res.ok) throw new Error("Server error");
      const data: State = await res.json();
      setState(data);
      setFetchError(false);
      if (data.lastClaimAt) {
        const elapsed   = Date.now() - new Date(data.lastClaimAt).getTime();
        const remaining = Math.max(0, data.cooldownMs - elapsed);
        setCooldownLeft(Math.ceil(remaining / 1000));
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchState(); }, [fetchState]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => {
      setCooldownLeft(p => {
        if (p <= 1) { clearInterval(t); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  const computeTargetRotation = useCallback((segIdx: number, currentRot: number) => {
    const segCenter = segIdx * SLICE_DEG + SLICE_DEG / 2;
    const jitter    = (Math.random() - 0.5) * SLICE_DEG * 0.4;
    const snapAngle = ((360 - segCenter + jitter) % 360 + 360) % 360;
    const curNorm   = ((currentRot % 360) + 360) % 360;
    let delta       = snapAngle - curNorm;
    if (delta < 0) delta += 360;
    return currentRot + 1800 + delta;
  }, []);

  const settleSpin = useCallback(() => {
    const r = pendingResult.current;
    if (!r) return;
    pendingResult.current = null;

    setState(prev =>
      prev ? { ...prev, credits: r.credits, claimsToday: r.claimsToday, totalSpins: r.totalSpins } : prev
    );
    setCooldownLeft(Math.ceil(r.cooldownMs / 1000));

    if (r.rewardType === "tryagain") {
      setMessage({ type: "tryagain", text: "Try again! Better luck next spin 🔄" });
    } else if (r.reward === 10) {
      setMessage({ type: "success", text: "🎉 +10 credits earned!" });
    } else if (r.reward === 2) {
      setMessage({ type: "success", text: "✨ +2 credits earned!" });
    } else {
      setMessage({ type: "success", text: "+1 credit earned!" });
    }

    setSpinning(false);
    setClaiming(false);
  }, []);

  const executeClaim = useCallback(async (token: string | null) => {
    setSpinning(true);
    setClaiming(true);
    setMessage(null);

    let res: Response;
    try {
      res = await fetch("/api/credits/claim", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ captchaToken: token ?? undefined }),
      });
    } catch {
      setMessage({ type: "error", text: "Network error — please try again." });
      setSpinning(false);
      setClaiming(false);
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      if (data.needsCaptcha) {
        setShowCaptcha(true);
        setMessage({ type: "error", text: "Please complete the captcha to continue." });
      } else {
        setMessage({ type: "error", text: data.error ?? "Something went wrong." });
      }
      setSpinning(false);
      setClaiming(false);
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
      return;
    }

    const segIdx:     number = typeof data.segmentIndex === "number" ? data.segmentIndex : 0;
    const reward:     number = typeof data.reward       === "number" ? data.reward       : 1;
    const rewardType: string = data.rewardType ?? "credit";
    const cooldownMs: number = data.cooldownMs ?? state?.cooldownMs ?? 2000;

    pendingResult.current = {
      credits:     data.credits,
      claimsToday: data.claimsToday,
      totalSpins:  data.totalSpins ?? (state?.totalSpins ?? 0),
      reward,
      rewardType,
      cooldownMs,
    };

    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();

    if (skipAnim) {
      const snap = ((360 - (segIdx * SLICE_DEG + SLICE_DEG / 2)) % 360 + 360) % 360;
      setDisplayRotation(snap);
      settleSpin();
      return;
    }

    setDisplayRotation(prev => {
      const newRot = computeTargetRotation(segIdx, prev);
      setTimeout(settleSpin, SPIN_MS);
      return newRot;
    });
  }, [state, skipAnim, computeTargetRotation, settleSpin]);

  const spin = useCallback(() => {
    if (!state || cooldownLeft > 0 || claiming || state.claimsToday >= state.dailyLimit || spinning) return;

    const needsCaptcha = state.claimsToday > 0 && state.claimsToday % state.captchaEvery === 0;

    if (needsCaptcha && !captchaToken) {
      setShowCaptcha(true);
      setMessage({ type: "error", text: "Please complete the captcha to continue." });
      return;
    }

    executeClaim(captchaToken);
  }, [state, cooldownLeft, claiming, spinning, captchaToken, executeClaim]);

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
    setShowCaptcha(false);
    executeClaim(token);
  }, [executeClaim]);

  const handleCaptchaCancel = useCallback(() => {
    setShowCaptcha(false);
    setSpinning(false);
    setClaiming(false);
    setCaptchaToken(null);
    setMessage(null);
    captchaRef.current?.resetCaptcha();
  }, []);

  const atLimit    = state ? state.claimsToday >= state.dailyLimit : false;
  const onCooldown = cooldownLeft > 0;
  const canSpin    = !atLimit && !onCooldown && !claiming && !loading && !spinning && !!state;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="w-8 h-8 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-white bg-transparent">
        <p className="text-red-400 font-semibold">Failed to load earn page. Please check your connection.</p>
        <button
          onClick={() => { setLoading(true); setFetchError(false); fetchState(); }}
          className="px-5 py-2 rounded-full border border-[#FFB800]/40 text-[#FFB800] text-sm font-bold hover:bg-[#FFB800]/10 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] flex-1 flex flex-col items-center justify-center font-sans text-white overflow-hidden py-6 px-8 md:px-12 lg:px-16 selection:bg-[#FFB800] selection:text-black bg-transparent">

      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="w-[400px] h-[400px] bg-[#FFB800] opacity-[0.03] blur-[100px] rounded-full lg:translate-x-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">

          {atLimit ? (
            <h1 className="text-white text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tight leading-[0.95] uppercase">
              Free Spin <br /><span className="text-[#FFB800]">Used</span>
            </h1>
          ) : (
            <>
              <p className="text-[#FFB800] font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 lg:mb-5">
                Free spin every day
              </p>
              <h1 className="text-white text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tighter leading-[0.85] uppercase">
                Spin<br />The<br />Wheel
              </h1>
            </>
          )}

          <div className="flex gap-3 w-full max-w-sm mt-8 lg:mt-10">
            <div className="flex-1 bg-transparent border border-[#FFB800]/30 rounded-[20px] py-3 md:py-4 flex flex-col items-center justify-center hover:border-[#FFB800]/60 hover:bg-[#FFB800]/5 transition-all">
              <p className="text-gray-400 text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold">Credits</p>
              <p className="text-white text-2xl md:text-3xl font-black">{state?.credits ?? 0}</p>
            </div>
            <div className="flex-1 bg-transparent border border-[#FFB800]/30 rounded-[20px] py-3 md:py-4 flex flex-col items-center justify-center hover:border-[#FFB800]/60 hover:bg-[#FFB800]/5 transition-all">
              <p className="text-gray-400 text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold">Spins Today</p>
              <p className="text-white text-2xl md:text-3xl font-black flex items-baseline gap-1">
                {state?.claimsToday ?? 0}
                <span className="text-gray-500 text-base font-bold">/ {state?.dailyLimit ?? 10}</span>
              </p>
            </div>
          </div>

          <div className="mt-3 w-full max-w-sm">
            <div className="bg-transparent border border-white/5 rounded-[16px] py-2.5 px-4 flex items-center justify-between">
              <span className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Lifetime Spins</span>
              <span className="text-white text-sm font-black tabular-nums">{state?.totalSpins ?? 0}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 group cursor-pointer" onClick={() => setSkipAnim(p => !p)}>
            <span className="text-gray-400 font-medium text-xs md:text-sm select-none transition-colors group-hover:text-gray-200">
              Skip animation
            </span>
            <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 border border-white/10 ${skipAnim ? "bg-[#FFB800]" : "bg-[#18181b]"}`}>
              <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${skipAnim ? "translate-x-[24px]" : "translate-x-0"}`} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center shrink-0">

          <div className="relative flex flex-col items-center shrink-0 mt-2 mb-4">

            <div className="absolute -top-5 z-30 drop-shadow-[0_0_12px_rgba(255,184,0,0.8)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 22L2 2H22L12 22Z" fill="#09090b" stroke="#FFB800" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] lg:w-[360px] lg:h-[360px] xl:w-[420px] xl:h-[420px] rounded-full shadow-[0_0_50px_rgba(255,184,0,0.15)] ring-4 ring-[#FFB800] ring-offset-4 ring-offset-[#09090b]">

              <WheelSVG rotation={displayRotation} spinning={spinning} skipAnim={skipAnim} />

              <button
                onClick={spin}
                disabled={!canSpin}
                className="absolute rounded-full flex flex-col items-center justify-center z-20 transition-all active:scale-[0.97] disabled:active:scale-100 disabled:opacity-90 w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                style={{
                  top:        "50%",
                  left:       "50%",
                  transform:  "translate(-50%,-50%)",
                  background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #e4e4e7 100%)",
                  boxShadow:  "0 10px 25px -5px rgba(0,0,0,0.8), inset 0 -4px 8px rgba(0,0,0,0.15)",
                  border:     "6px solid #09090b",
                  cursor:     canSpin ? "pointer" : "not-allowed",
                }}
              >
                {atLimit ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[#52525b] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5">Resets In</span>
                    <span className="text-[#09090b] text-base md:text-xl font-black font-mono tracking-tighter leading-none">
                      {`${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`}
                    </span>
                  </div>
                ) : onCooldown ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[#52525b] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5">Wait</span>
                    <span className="text-[#09090b] text-base md:text-xl font-black font-mono tracking-tighter leading-none">
                      {formatCooldown(cooldownLeft)}
                    </span>
                  </div>
                ) : (
                  <span
                    className="text-[#09090b] text-xl md:text-2xl font-black tracking-tight"
                    style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}
                  >
                    {spinning ? "…" : "SPIN"}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="h-6 flex items-center justify-center mt-2">
            {message && (
              <p className={`text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-md border ${
                message.type === "success"
                  ? "text-[#FFB800] bg-[#FFB800]/10 border-[#FFB800]/20 shadow-[0_0_15px_rgba(255,184,0,0.2)]"
                  : message.type === "tryagain"
                    ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
                    : "text-red-400 bg-red-400/10 border-red-400/20"
              }`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>

      {showCaptcha && (
        <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-[#FFB800]/20 p-8 rounded-3xl flex flex-col items-center max-w-md w-full shadow-[0_0_40px_rgba(255,184,0,0.1)]">
            <div className="w-12 h-12 rounded-full bg-[#FFB800]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-black mb-2">Human Check</h3>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Complete the verification below to claim your credits and continue spinning.
            </p>

            {!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? (
              <p className="text-red-400 text-sm font-semibold">
                hCaptcha site key is not configured. Please contact support.
              </p>
            ) : (
              <div className="bg-black/50 p-2 rounded-xl border border-white/5 w-full flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                  onVerify={handleCaptchaVerify}
                  theme="dark"
                />
              </div>
            )}

            <button
              onClick={handleCaptchaCancel}
              className="mt-8 text-gray-500 hover:text-white font-medium text-sm transition-colors uppercase tracking-widest"
            >
              Cancel Spin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}