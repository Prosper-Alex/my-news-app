import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * Middleware for authentication-based redirects
 * - Redirect authenticated users away from /login and /register
 * - Redirect unauthenticated users away from /dashboard
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getServerSession(authOptions);

  // If user is logged in and tries to access login/register, redirect to dashboard
  if (session?.user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and tries to access dashboard, redirect to login
  if (!session?.user && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/login", "/register", "/dashboard", "/onboarding"],
};
