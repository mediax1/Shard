import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
  const scope = encodeURIComponent("identify email guilds.join");

  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");

  const state = Buffer.from(JSON.stringify({ ref: ref ?? null })).toString("base64");

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(discordAuthUrl);
}