import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/cryptomus";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!verifyWebhook(body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const { order_id, status } = body;

  if (status !== "paid" && status !== "paid_over") {
    return NextResponse.json({ ok: true });
  }

  const db = (await clientPromise).db();

  const payment = await db.collection("pending_payments").findOneAndUpdate(
    { orderId: order_id, status: "pending" },
    { $set: { status: "completed", completedAt: new Date() } }
  );

  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  const paidTierPlans = ["classic", "boost", "mega", "super"];
  const shouldUpgradeTier = paidTierPlans.includes(payment.planId);

  await db.collection("users").updateOne(
    { discordId: payment.discordId },
    {
      $inc: { credits: payment.credits },
      ...(shouldUpgradeTier && { $set: { tier: "paid" } }),
    }
  );

  return NextResponse.json({ ok: true });
}