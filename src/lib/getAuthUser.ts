import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export type AuthenticatedUser = {
  id: string;
  username: string;
  avatar: string | null;
  email: string | null;
  discordId: string;
};

export type AuthResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; reason: "unauthorized" | "banned" | "not_found" };

export async function getAuthenticatedUser(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { ok: false, reason: "unauthorized" };

  let payload;
  try {
    payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return { ok: false, reason: "unauthorized" };
  }

  if (!payload?.id) return { ok: false, reason: "unauthorized" };

  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne(
    { discordId: payload.id },
    { projection: { banned: 1, discordId: 1 } }
  );

  if (!record) return { ok: false, reason: "not_found" };
  if (record.banned === true) return { ok: false, reason: "banned" };

  return {
    ok: true,
    user: {
      id: payload.id,
      username: payload.username,
      avatar: payload.avatar,
      email: payload.email,
      discordId: payload.id,
    },
  };
}
