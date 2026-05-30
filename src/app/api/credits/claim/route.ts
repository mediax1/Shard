import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/getAuthUser";

const DAILY_LIMIT = 10;
const COOLDOWN_MS = 2 * 1000;
const CAPTCHA_EVERY = 3;
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

function getISTDateString(date: Date): string {
  const ist = new Date(date.getTime() + IST_OFFSET);
  return ist.toISOString().slice(0, 10);
}

function getNextMidnightIST(): Date {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET);
  const nextMidnightIST = new Date(istNow);
  nextMidnightIST.setUTCHours(24, 0, 0, 0);
  return new Date(nextMidnightIST.getTime() - IST_OFFSET);
}

export async function GET() {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;
  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne({ discordId: user.id });

  const todayIST = getISTDateString(new Date());
  const claimsToday = record?.claimDate === todayIST ? (record?.claimsToday ?? 0) : 0;
  const nextReset = getNextMidnightIST();

  return NextResponse.json({
    credits: record?.credits ?? 0,
    claimsToday,
    dailyLimit: DAILY_LIMIT,
    lastClaimAt: record?.lastClaimAt ?? null,
    cooldownMs: COOLDOWN_MS,
    captchaEvery: CAPTCHA_EVERY,
    nextResetAt: nextReset.toISOString(),
    totalSpins: record?.totalSpins ?? 0,
  });
}

const WHEEL_SEGMENTS = [
  { segmentIndex: 0, reward: 1, rewardType: "credit", weight: 800000 },
  { segmentIndex: 1, reward: 2, rewardType: "credit", weight: 5000 },
  { segmentIndex: 2, reward: 10, rewardType: "credit", weight: 1 },
  { segmentIndex: 3, reward: 0, rewardType: "tryagain", weight: 195000 },
];

function pickSegment() {
  const totalWeight = WHEEL_SEGMENTS.reduce((s, seg) => s + seg.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const seg of WHEEL_SEGMENTS) {
    rand -= seg.weight;
    if (rand <= 0) return seg;
  }
  return WHEEL_SEGMENTS[0];
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth.ok) {
    if (auth.reason === "banned") return NextResponse.json({ error: "Account banned." }, { status: 403 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = auth.user;

  let body: { captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const now = new Date();
  const todayIST = getISTDateString(now);
  const record = await col.findOne({ discordId: user.id });

  if (!record) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const claimsToday = record.claimDate === todayIST ? (record.claimsToday ?? 0) : 0;

  if (claimsToday >= DAILY_LIMIT) {
    const resetAt = getNextMidnightIST();
    return NextResponse.json({ error: "Daily limit reached.", resetAt: resetAt.toISOString() }, { status: 429 });
  }

  const lastClaimAt = record.lastClaimAt ? new Date(record.lastClaimAt).getTime() : 0;
  const msSinceLast = now.getTime() - lastClaimAt;
  if (msSinceLast < COOLDOWN_MS) {
    const waitSeconds = Math.ceil((COOLDOWN_MS - msSinceLast) / 1000);
    return NextResponse.json({ error: `Wait ${waitSeconds}s before claiming again.` }, { status: 429 });
  }

  const needsCaptcha = claimsToday > 0 && claimsToday % CAPTCHA_EVERY === 0;
  if (needsCaptcha) {
    if (!body.captchaToken) {
      return NextResponse.json({ error: "Captcha required.", needsCaptcha: true }, { status: 400 });
    }
    const verifyRes = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY!,
        response: body.captchaToken,
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha verification failed.", needsCaptcha: true }, { status: 400 });
    }
  }

  const spin = pickSegment();
  const creditReward = spin.reward;

  const newClaimsToday = claimsToday + 1;

  const result = await col.findOneAndUpdate(
    {
      discordId: user.id,
      $or: [
        { claimDate: { $ne: todayIST } },
        { claimsToday: { $lt: DAILY_LIMIT } },
      ],
    },
    {
      $inc: { credits: creditReward, totalSpins: 1 },
      $set: {
        lastClaimAt: now,
        claimDate: todayIST,
        claimsToday: newClaimsToday,
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return NextResponse.json({ error: "Daily limit reached." }, { status: 429 });
  }

  return NextResponse.json({
    success: true,
    credits: result.credits ?? 0,
    claimsToday: newClaimsToday,
    dailyLimit: DAILY_LIMIT,
    totalSpins: result.totalSpins ?? 0,
    segmentIndex: spin.segmentIndex,
    reward: spin.reward,
    rewardType: spin.rewardType,
    cooldownMs: COOLDOWN_MS,
  });
}