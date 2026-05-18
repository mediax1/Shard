import crypto from "crypto";

const MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID!;
const API_KEY = process.env.CRYPTOMUS_API_KEY!;

function sign(body: object): string {
  const json = Buffer.from(JSON.stringify(body)).toString("base64");
  return crypto.createHash("md5").update(json + API_KEY).digest("hex");
}

export async function createInvoice(params: {
  amount: number;
  orderId: string;
  currency?: string;
}) {
  const body = {
    amount: params.amount.toFixed(2),
    currency: params.currency ?? "USD",
    order_id: params.orderId,
    url_callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
    url_return: `${process.env.NEXT_PUBLIC_BASE_URL}/panel/pricings?status=success`,
    url_success: `${process.env.NEXT_PUBLIC_BASE_URL}/panel/pricings?status=success`,
    lifetime: 3600,
    is_payment_multiple: false,
  };

  const res = await fetch("https://api.cryptomus.com/v1/payment", {
    method: "POST",
    headers: {
      merchant: MERCHANT_ID,
      sign: sign(body),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || data.state !== 0) {
    throw new Error(data?.message ?? "Cryptomus invoice creation failed");
  }

  return data.result as {
    uuid: string;
    url: string;
    order_id: string;
  };
}

export function verifyWebhook(body: Record<string, unknown>): boolean {
  const receivedSign = body.sign as string;
  const { sign: _, ...rest } = body;
  const json = Buffer.from(JSON.stringify(rest)).toString("base64");
  const expected = crypto.createHash("md5").update(json + API_KEY).digest("hex");
  return receivedSign === expected;
}