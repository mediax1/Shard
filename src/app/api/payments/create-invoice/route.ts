import { NextRequest, NextResponse } from "next/server";
import { createInvoice } from "@/lib/cryptomus";
import { plans } from "@/components/pricing/PricingPlans";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/getAuthUser";

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { planId } = body;
  const plan = plans.find((p) => p.planId === planId);

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const db = (await clientPromise).db();

  const recentPending = await db.collection("pending_payments").findOne({
    discordId: user.id,
    planId: plan.planId,
    status: "pending",
    createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
  });

  if (recentPending) {
    return NextResponse.json({ url: `https://pay.cryptomus.com/pay/${recentPending.invoiceUuid}` });
  }

  const orderId = `${user.id}-${plan.planId}-${Date.now()}`;

  try {
    const invoice = await createInvoice({ amount: plan.amount, orderId });

    await db.collection("pending_payments").insertOne({
      orderId,
      discordId: user.id,
      planId: plan.planId,
      credits: plan.totalCredits,
      amount: plan.amount,
      invoiceUuid: invoice.uuid,
      createdAt: new Date(),
      status: "pending",
    });

    return NextResponse.json({ url: invoice.url });
  } catch (err) {
    console.error("[create-invoice]", err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}