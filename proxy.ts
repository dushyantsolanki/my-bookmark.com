import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Verify token if it exists
  const decoded = accessToken ? await verifyTokenEdge(accessToken) : null;
  const isAuthenticated = !!decoded;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isApiRoute = pathname.startsWith("/api");
  const isPublicApiRoute = pathname === "/api/auth/login" ||
    pathname === "/api/auth/register" ||
    pathname === "/api/auth/logout";

  // 1. Handle API Routes
  if (isApiRoute && !isPublicApiRoute) {
    if (!isAuthenticated || !decoded) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Pass verified userId to the API route via headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", (decoded as any).userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Handle Frontend Routes
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isAuthRoute && !isApiRoute && !pathname.startsWith("/_next") && !pathname.startsWith("/static") && pathname !== "/favicon.ico") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear invalid cookie if it exists
    if (accessToken) {
      response.cookies.delete("accessToken");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
