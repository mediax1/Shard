import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { deletePteroServer, suspendPteroServer, unsuspendPteroServer } from "@/lib/pterodactyl";
import type { ModerationStatus } from "@/lib/serverUtils";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { discordId: string; action: "ban" | "unban" | "suspend" | "unsuspend"; reason?: string; serverId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { discordId, action, reason, serverId } = body;

  if (!discordId || !action) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (action === "ban" && !reason) {
    return NextResponse.json({ error: "A reason is required when banning." }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId });

  if (!record) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (action === "ban") {
    if (record.banned) {
      return NextResponse.json({ error: "User is already banned." }, { status: 400 });
    }

    const servers: Array<{ id: string; pteroId: string; status: string }> = record.servers ?? [];
    const deleteResults: Array<{ id: string; ok: boolean; error?: string }> = [];

    for (const server of servers) {
      if (server.status === "deleted") continue;
      try {
        await deletePteroServer(Number(server.pteroId));
        deleteResults.push({ id: server.id, ok: true });
      } catch (err) {
        deleteResults.push({ id: server.id, ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    await col.updateOne(
      { discordId },
      {
        $set: {
          banned: true,
          bannedReason: reason,
          bannedAt: new Date(),
          "servers.$[elem].status": "deleted",
        },
      },
      { arrayFilters: [{ "elem.status": { $ne: "deleted" } }] }
    );

    return NextResponse.json({ success: true, action: "ban", discordId, reason, serversDeleted: deleteResults });
  }

  if (action === "unban") {
    if (!record.banned) {
      return NextResponse.json({ error: "User is not banned." }, { status: 400 });
    }

    await col.updateOne(
      { discordId },
      {
        $set: { banned: false },
        $unset: { bannedReason: "", bannedAt: "" },
      }
    );

    return NextResponse.json({ success: true, action: "unban", discordId });
  }

  if (action === "suspend" || action === "unsuspend") {
    if (!serverId) {
      return NextResponse.json({ error: "serverId is required for suspend/unsuspend." }, { status: 400 });
    }

    const server = (record.servers ?? []).find((s: { id: string }) => s.id === serverId);
    if (!server) {
      return NextResponse.json({ error: "Server not found." }, { status: 404 });
    }
    if (server.status === "deleted") {
      return NextResponse.json({ error: "Cannot moderate a deleted server." }, { status: 400 });
    }

    let newModerationStatus: ModerationStatus;

    if (action === "suspend") {
      newModerationStatus = "suspended";
      try {
        await suspendPteroServer(server.pteroId);
      } catch (err) {
        return NextResponse.json({ error: `Pterodactyl error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
      }
    } else {
      newModerationStatus = "clean";
      try {
        await unsuspendPteroServer(server.pteroId);
      } catch (err) {
        return NextResponse.json({ error: `Pterodactyl error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
      }
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

    return NextResponse.json({ success: true, serverId, moderationStatus: newModerationStatus, reason: reason ?? null });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}