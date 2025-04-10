import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  // Root route is always accessible
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "USER") {
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!token || !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const parsedUser = JSON.parse(user);

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (parsedUser.role !== "ADMIN" && parsedUser.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
