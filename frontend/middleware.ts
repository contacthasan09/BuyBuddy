import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Allow /admin/login through — never block the login page ──
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ── For /admin/* (except login) — check hint cookie ──
  if (pathname.startsWith("/admin")) {
    const hint = req.cookies.get("bd_admin_hint")?.value;

    if (hint !== "1") {
      // No hint → not logged in → go to login (once, no reason param)
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only match admin routes — skip static assets, api, etc.
  matcher: ["/admin/:path*"],
};