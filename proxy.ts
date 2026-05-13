import { NextResponse, type NextRequest } from "next/server";

import { adminOnlyRoutes, protectedRoutes } from "@/lib/constants";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token";

function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/viewer" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/viewer/verify") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  );
}

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    if (pathname === "/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        try {
          await verifySessionToken(token);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch {
          return NextResponse.next();
        }
      }
    }
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const session = await verifySessionToken(token);

    if (
      session.role === "STREET_REP" &&
      adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"]
};
