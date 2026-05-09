import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const discordId = request.nextUrl.searchParams.get("discordId");
  if (!discordId) {
    return NextResponse.json({ error: "Missing discordId" }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ discordId });

  if (!user) {
    return NextResponse.json({ banned: false });
  }

  return NextResponse.json({
    banned: user.banned === true,
    bannedReason: user.bannedReason ?? null,
  });
}