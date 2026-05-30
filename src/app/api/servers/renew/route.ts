import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { unsuspendPteroServer } from "@/lib/pterodactyl";
import { PLANS, type PlanKey, type Duration } from "@/lib/plans";
import { isRenewable } from "@/lib/serverUtils";
import { getAuthenticatedUser } from "@/lib/getAuthUser";



export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;

  let body: { serverId: string; duration: Duration };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { serverId, duration } = body;

  if (!serverId || ![7, 30].includes(duration)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId: user.id });

  if (!record) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const server = (record.servers ?? []).find((s: { id: string }) => s.id === serverId);
  if (!server) return NextResponse.json({ error: "Server not found." }, { status: 404 });
  if (!isRenewable(server)) {
    const reason =
      server.status === "deleted"
        ? "Server has been deleted and cannot be renewed."
        : "This server has been suspended for TOS violations and cannot be renewed. Contact support.";
    return NextResponse.json({ error: reason }, { status: 403 });
  }

  const plan = server.plan as PlanKey;
  const cost = duration === 7 ? PLANS[plan].price7 : PLANS[plan].price30;

  if (record.credits < cost) {
    return NextResponse.json({ error: `Not enough credits. You need ${cost} credits.` }, { status: 400 });
  }

  const currentExpiry = new Date(server.expiresAt).getTime();
  const base = currentExpiry > Date.now() ? currentExpiry : Date.now();
  const newExpiry = new Date(base + duration * 24 * 60 * 60 * 1000);

  if (server.status === "suspended") {
    await unsuspendPteroServer(server.pteroId);
  }

  const updated = await col.findOneAndUpdate(
    { discordId: user.id, "servers.id": serverId },
    {
      $inc: { credits: -cost },
      $set: {
        "servers.$.expiresAt": newExpiry,
        "servers.$.status": "active",
        "servers.$.duration": duration,
        "servers.$.suspendedAt": null,
        "servers.$.graceEndsAt": null,
      },
    },
    { returnDocument: "after" }
  );

  return NextResponse.json({
    success: true,
    newExpiry: newExpiry.toISOString(),
    creditsLeft: updated?.credits ?? 0,
  });
}