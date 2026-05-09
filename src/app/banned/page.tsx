import { cookies } from "next/headers";

export default async function BannedPage() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("token")?.value;

  let reason: string | null = null;

  if (rawToken) {
    try {
      const token = decodeURIComponent(rawToken);
      const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      const discordId = payload?.id;

      if (discordId) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/check-ban?discordId=${discordId}`,
          { headers: { "x-internal-secret": process.env.INTERNAL_SECRET! } }
        );
        const data = await res.json();
        reason = data.bannedReason ?? null;
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-500">Banned</h1>
        <p className="text-white text-lg">Your account has been banned.</p>
        {reason && (
          <p className="text-zinc-400 text-sm">Reason: {reason}</p>
        )}
      </div>
    </div>
  );
}