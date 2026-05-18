import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = (await clientPromise).db();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const result = await db.collection("pending_payments").updateMany(
    {
      status: "pending",
      createdAt: { $lt: oneHourAgo },
    },
    { $set: { status: "expired" } }
  );

  return NextResponse.json({ expired: result.modifiedCount });
}