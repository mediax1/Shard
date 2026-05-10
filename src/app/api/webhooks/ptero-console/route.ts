import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { suspendPteroServer } from "@/lib/pterodactyl";
import { scanContent } from "@/lib/malwareDetector";
import { sendMalwareAlert } from "@/lib/webhookAlert";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.PTERO_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    server_uuid?: string;
    event?: string;
    args?: string[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { server_uuid, event, args } = body;

  if (!server_uuid || event !== "console_output" || !args?.length) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const consoleOutput = args.join("\n");
  const { detected, matches } = scanContent(consoleOutput);

  if (!detected) {
    return NextResponse.json({ ok: true, detected: false });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");

  const user = await col.findOne({ "servers.pteroUuid": server_uuid });
  if (!user) {
    return NextResponse.json({ error: "No user found for this server UUID." }, { status: 404 });
  }

  const server = (user.servers ?? []).find(
    (s: { pteroUuid: string }) => s.pteroUuid === server_uuid
  );

  if (!server) {
    return NextResponse.json({ error: "Server not found in user document." }, { status: 404 });
  }

  if (server.status === "deleted" || server.moderationStatus === "suspended") {
    return NextResponse.json({ ok: true, skipped: true, reason: "Already handled." });
  }

  const now = new Date();

  try {
    await suspendPteroServer(Number(server.pteroId));
  } catch (err) {
    return NextResponse.json(
      { error: `Pterodactyl suspend failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }

  await col.updateOne(
    { _id: user._id, "servers.id": server.id },
    {
      $set: {
        "servers.$.moderationStatus": "suspended",
        "servers.$.moderationReason": "Malicious code detected",
        "servers.$.moderationAt": now,
      },
    }
  );

  await sendMalwareAlert({
    discordId: user.discordId,
    serverId: server.id,
    pteroId: Number(server.pteroId),
    matches,
    timestamp: now,
  });

  return NextResponse.json({ ok: true, detected: true, serverId: server.id, patterns: matches.map((m) => m.patternId) });
}