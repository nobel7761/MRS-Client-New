import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole, UserType } from "@/types/auth";
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  // Root route is always accessible
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/faqs",
    "/about",
    "/contact",
    "/team",
    "/blogs",
    "/representative-registration-reunion-2026",
    "/test-api",
  ];

  // Check if the current path is a blog detail route (e.g., /blogs/some-slug)
  const isBlogDetailRoute =
    pathname.startsWith("/blogs/") && pathname !== "/blogs";

  // Routes that require authentication but are accessible to all authenticated users
  const authenticatedRoutes = ["/profile"];

  if (publicRoutes.includes(pathname) || isBlogDetailRoute) {
    // Allow all users (including admin/superadmin) to access public routes and blog detail routes
    return NextResponse.next();
  }

  // Handle authenticated routes (accessible to all authenticated users)
  if (authenticatedRoutes.includes(pathname)) {
    if (!token || !user) {
      return NextResponse.redirect(new URL("/login", request.url));
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
    // Handle both userType and usetType (typo in backend data)
    const userType = parsedUser.userType || parsedUser.usetType;

    // Check if user has proper role and userType combination
    const hasValidAccess =
      (parsedUser.role === UserRole.SUPER_ADMIN &&
        userType === UserType.OWNER) ||
      (parsedUser.role === UserRole.ADMIN && userType === UserType.COLLECTOR) ||
      (parsedUser.role === UserRole.USER && userType === UserType.COLLECTOR);

    if (!hasValidAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // FAQs routes protection - only SUPER_ADMIN + OWNER can access
    if (pathname.startsWith("/admin/faqs")) {
      if (
        parsedUser.role !== UserRole.SUPER_ADMIN ||
        userType !== UserType.OWNER
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    // Events routes protection - only SUPER_ADMIN + OWNER can access
    if (pathname.startsWith("/admin/events")) {
      if (
        parsedUser.role !== UserRole.SUPER_ADMIN ||
        userType !== UserType.OWNER
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    // Email Management routes protection - only SUPER_ADMIN + OWNER can access
    if (pathname.startsWith("/admin/email")) {
      if (
        parsedUser.role !== UserRole.SUPER_ADMIN ||
        userType !== UserType.OWNER
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
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
