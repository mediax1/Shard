import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const rawToken = request.cookies.get("token")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  const { pathname } = request.nextUrl;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  if (pathname.startsWith("/banned")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/panel") && !token) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  if (pathname === "/login" && token) {
    const banCheck = await checkBan(token, baseUrl);
    if (banCheck === "banned") {
      return NextResponse.redirect(new URL("/banned", baseUrl));
    }
    return NextResponse.redirect(new URL("/panel", baseUrl));
  }

  if (pathname.startsWith("/panel") && token) {
    const banCheck = await checkBan(token, baseUrl);
    if (banCheck === "banned") {
      const response = NextResponse.redirect(new URL("/banned", baseUrl));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

async function checkBan(token: string, baseUrl: string): Promise<"banned" | "ok" | "error"> {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const discordId = payload?.id;
    if (!discordId) return "error";

    const res = await fetch(
      `${baseUrl}/api/auth/check-ban?discordId=${discordId}`,
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SECRET!,
        },
      }
    );

    if (!res.ok) return "error";
    const data = await res.json();
    return data.banned === true ? "banned" : "ok";
  } catch {
    return "error";
  }
}

export const config = {
  matcher: ["/panel/:path*", "/login", "/banned"],
};