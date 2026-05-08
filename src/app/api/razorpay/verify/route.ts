import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

// Plans that unlock Premium Node → upgrade user tier to "paid"
const PREMIUM_NODE_PLANS = new Set(['boost', 'mega', 'super']);

// Credit amounts awarded per planId
const PLAN_CREDITS: Record<string, number> = {
  starter: 100,
  classic: 350,  // 300 + 50 bonus
  boost:   600,  // 500 + 100 bonus
  mega:    1200, // 1000 + 200 bonus
  super:   2400, // 2000 + 400 bonus
};

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } =
    await req.json();

  // 1. Verify payment signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // 2. Identify the logged-in user from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let discordId: string;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    discordId = decoded.id;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
  }

  // 3. Build the MongoDB update
  const creditsToAdd = PLAN_CREDITS[planId] ?? 0;
  const upgradesTier = PREMIUM_NODE_PLANS.has(planId);

  const updateDoc: Record<string, unknown> = {
    $inc: { credits: creditsToAdd },
  };

  if (upgradesTier) {
    updateDoc.$set = { tier: 'paid' };
  }

  const db = (await clientPromise).db();
  await db.collection('users').updateOne({ discordId }, updateDoc as any);

  return NextResponse.json({ success: true, tierUpgraded: upgradesTier });
}