import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { suspendPteroServer, unsuspendPteroServer } from "@/lib/pterodactyl";
import type { ModerationStatus } from "@/lib/serverUtils";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

let body: { discordId: string; serverId: string; action: "suspend" | "unsuspend"; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { discordId, serverId, action, reason } = body;

  if (!discordId || !serverId || !action) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId });
  if (!record) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const server = (record.servers ?? []).find((s: { id: string }) => s.id === serverId);
  if (!server) return NextResponse.json({ error: "Server not found." }, { status: 404 });
  if (server.status === "deleted") return NextResponse.json({ error: "Cannot moderate a deleted server." }, { status: 400 });

  let newModerationStatus: ModerationStatus;

  switch (action) {
    case "suspend":
      newModerationStatus = "suspended";
      try { await suspendPteroServer(server.pteroId); } catch (err) {
        return NextResponse.json({ error: `Pterodactyl error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
      }
      break;
    case "unsuspend":
      newModerationStatus = "clean";
      try { await unsuspendPteroServer(server.pteroId); } catch (err) {
        return NextResponse.json({ error: `Pterodactyl error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
      }
      break;
    default:
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  await col.updateOne(
    { discordId, "servers.id": serverId },
    {
      $set: {
        "servers.$.moderationStatus": newModerationStatus,
        "servers.$.moderationReason": reason ?? null,
        "servers.$.moderationAt": new Date(),
      },
    }
  );

  return NextResponse.json({
    success: true,
    serverId,
    moderationStatus: newModerationStatus,
    reason: reason ?? null,
  });
}