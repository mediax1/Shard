import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/cryptomus";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!verifyWebhook(body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const { order_id, status } = body;

  if (status !== "paid" && status !== "paid_over" && status !== "paid_under") {
    return NextResponse.json({ ok: true });
  }

  const db = (await clientPromise).db();
  const payment = await db.collection("pending_payments").findOne({ orderId: order_id });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (payment.status === "completed") {
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

  await db.collection("pending_payments").updateOne(
    { orderId: order_id },
    { $set: { status: "completed", completedAt: new Date() } }
  );

  return NextResponse.json({ ok: true });
}