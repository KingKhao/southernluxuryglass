import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const username = await verifySessionToken(token);

  const isLoginPage = pathname === "/admin/login";

  if (!username && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Login stays reachable even when a signed session has been revoked server-side.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
