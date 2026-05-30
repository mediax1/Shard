import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { getAuthenticatedUser } from "@/lib/getAuthUser";

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;
  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne({ discordId: user.id });

  if (!record) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const referralCode = record.referralCode ?? null;
  const referralCount = record.referralCount ?? 0;
  const referralEarnings = record.referralEarnings ?? 0;

  const referrals = await db
    .collection("users")
    .find({ referredBy: user.id })
    .project({ username: 1, createdAt: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json({
    referralCode,
    referralCount,
    referralEarnings,
    referrals,
    referralLink: referralCode
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/login?ref=${referralCode}`
      : null,
  });
}

export async function POST() {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;
  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne({ discordId: user.id });

  if (!record) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (record.referralCode) {
    return NextResponse.json({
      referralCode: record.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/login?ref=${record.referralCode}`,
    });
  }

  const code = crypto.randomBytes(4).toString("hex");

  const existing = await db.collection("users").findOne({ referralCode: code });
  if (existing) {
    const fallback = crypto.randomBytes(6).toString("hex");
    await db.collection("users").updateOne(
      { discordId: user.id },
      { $set: { referralCode: fallback, referralCount: 0, referralEarnings: 0 } }
    );
    return NextResponse.json({
      referralCode: fallback,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/login?ref=${fallback}`,
    });
  }

  await db.collection("users").updateOne(
    { discordId: user.id },
    { $set: { referralCode: code, referralCount: 0, referralEarnings: 0 } }
  );

  return NextResponse.json({
    referralCode: code,
    referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/login?ref=${code}`,
  });
}
