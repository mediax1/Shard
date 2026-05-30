import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { deletePteroServer } from "@/lib/pterodactyl";
import { getAuthenticatedUser } from "@/lib/getAuthUser";

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;

  let body: { serverId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { serverId } = body;
  if (!serverId) return NextResponse.json({ error: "Server ID required." }, { status: 400 });

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId: user.id });

  if (!record) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const server = (record.servers ?? []).find((s: { id: string }) => s.id === serverId);
  if (!server) return NextResponse.json({ error: "Server not found." }, { status: 404 });
  if (server.status === "deleted") return NextResponse.json({ error: "Already deleted." }, { status: 400 });

  try {
    if (server.pteroId) {
      await deletePteroServer(server.pteroId);
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete server from panel. Try again." }, { status: 500 });
  }

  await col.updateOne(
    { discordId: user.id, "servers.id": serverId },
    { $set: { "servers.$.status": "deleted" } }
  );

  return NextResponse.json({ success: true });
}