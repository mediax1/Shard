import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { amount, planId } = await req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'USD',
    receipt: `receipt_${planId}_${Date.now()}`,
  });

  return NextResponse.json(order);
}