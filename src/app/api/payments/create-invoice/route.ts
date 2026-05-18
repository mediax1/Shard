import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createInvoice } from "@/lib/cryptomus";
import { plans } from "@/components/pricing/PricingPlans";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await req.json();
  const plan = plans.find((p) => p.planId === planId);

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const orderId = `${user.id}-${plan.planId}-${Date.now()}`;

  try {
    const invoice = await createInvoice({ amount: plan.amount, orderId });

    const db = (await clientPromise).db();
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