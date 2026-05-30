import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { suspendPteroServer, deletePteroServer } from "@/lib/pterodactyl";

const GRACE_DAYS = 7;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const now = new Date();
  const graceCutoff = new Date(now.getTime() - GRACE_DAYS * 24 * 60 * 60 * 1000);

  const usersToSuspend = await col.find({
    servers: {
      $elemMatch: {
        status: "active",
        expiresAt: { $lte: now },
        $or: [
          { moderationStatus: { $exists: false } },
          { moderationStatus: "clean" },
        ],
      },
    },
  }).toArray();

  const usersToDelete = await col.find({
    servers: {
      $elemMatch: {
        status: "suspended",
        $and: [
          {
            $or: [
              { graceEndsAt: { $lte: now } },
              { graceEndsAt: { $exists: false }, expiresAt: { $lte: graceCutoff } },
            ],
          },
          {
            $or: [
              { moderationStatus: { $exists: false } },
              { moderationStatus: "clean" },
            ],
          },
        ],
      },
    },
  }).toArray();

  const results = { suspended: 0, deleted: 0, errors: [] as string[] };

  const suspendOps: Promise<void>[] = [];
  for (const user of usersToSuspend) {
    for (const server of user.servers ?? []) {
      if (server.status !== "active") continue;
      if (server.moderationStatus === "suspended") continue;
      if (new Date(server.expiresAt) > now) continue;

      suspendOps.push(
        (async () => {
          try {
            await suspendPteroServer(server.pteroId);
            const graceEndsAt = new Date(new Date(server.expiresAt).getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000);
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
          } catch (err) {
            results.errors.push(`Suspend ${server.id}: ${err instanceof Error ? err.message : String(err)}`);
          }
        })()
      );
    }
  }

  await Promise.all(suspendOps);

  const deleteOps: Promise<void>[] = [];
  for (const user of usersToDelete) {
    for (const server of user.servers ?? []) {
      if (server.status !== "suspended") continue;
      if (server.moderationStatus === "suspended") continue;

      const graceEndsAt = server.graceEndsAt
        ? new Date(server.graceEndsAt)
        : new Date(new Date(server.expiresAt).getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000);

      if (now < graceEndsAt) continue;

      deleteOps.push(
        (async () => {
          try {
            await deletePteroServer(server.pteroId);
            await col.updateOne(
              { _id: user._id, "servers.id": server.id },
              { $set: { "servers.$.status": "deleted", "servers.$.deletedAt": now } }
            );
            results.deleted++;
          } catch (err) {
            results.errors.push(`Delete ${server.id}: ${err instanceof Error ? err.message : String(err)}`);
          }
        })()
      );
    }
  }

  await Promise.all(deleteOps);

  return NextResponse.json({ ok: true, ...results });
}