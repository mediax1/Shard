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
    return NextResponse.redirect(new URL("/panel", baseUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/login"],
};
