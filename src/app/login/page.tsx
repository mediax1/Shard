"use client";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  no_code: "Authentication failed. Please try again.",
  token_failed: "Could not connect to Discord. Please try again.",
  user_failed: "Could not fetch your Discord profile. Please try again.",
  server_error: "Something went wrong. Please try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 px-4 w-full pt-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-black tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {errorMessages[error] ?? "An unknown error occurred."}
            </div>
          )}

          <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
            <button
              onClick={handleDiscordLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-[#FFB800] hover:bg-[#E5A500] text-white text-sm font-bold rounded-xl transition-colors duration-150 shadow-[0_0_25px_rgba(255,184,0,0.25)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.33-.35-.76-.53-1.09a.09.09 0 0 0-.07-.03c-1.5.26-2.94.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.03.06.04.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12z" />
              </svg>
              Continue with Discord
            </button>

            <p className="text-center text-gray-600 text-xs">
              By signing in you agree to our{" "}
              <Link href="/tos" className="text-[#FFB800]/70 hover:text-[#FFB800] transition-colors">
                Terms of Service
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <span className="text-gray-400">
              It&apos;s created automatically on first login.
            </span>
          </p>
        </div>
      </main>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}