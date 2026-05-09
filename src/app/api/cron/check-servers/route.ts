import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { suspendPteroServer, deletePteroServer } from "@/lib/pterodactyl";
import { isModerationBlocked } from "@/lib/serverUtils";


const GRACE_DAYS = 7;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const now = new Date();

  const users = await col.find({ "servers.0": { $exists: true } }).toArray();
  const results = { suspended: 0, deleted: 0, errors: [] as string[] };

  for (const user of users) {
    for (const server of user.servers ?? []) {
      try {
        if (server.status === "deleted") continue;
        if (isModerationBlocked(server)) continue;

        const expiresAt = new Date(server.expiresAt);

        const graceEndsAt = server.graceEndsAt
          ? new Date(server.graceEndsAt)
          : new Date(expiresAt.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000);

        if (now >= graceEndsAt && server.status === "suspended") {
          await deletePteroServer(server.pteroId);
          await col.updateOne(
            { _id: user._id, "servers.id": server.id },
            { $set: { "servers.$.status": "deleted", "servers.$.deletedAt": now } }
          );
          results.deleted++;

        } else if (now >= expiresAt && server.status === "active") {
          await suspendPteroServer(server.pteroId);
          await col.updateOne(
            { _id: user._id, "servers.id": server.id },
            {
              $set: {
                "servers.$.status": "suspended",
                "servers.$.suspendedAt": now,
                "servers.$.graceEndsAt": graceEndsAt,
              },
            }
          );
          results.suspended++;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.errors.push(`Server ${server.id}: ${msg}`);
      }
    }
  }

  return NextResponse.json({ ok: true, ...results });
}