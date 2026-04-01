import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

/**
 * Get the current user's session on the server
 * Use this in Server Components and API Routes
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user, or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Check if user is authenticated
 * Useful for middleware and API routes
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session?.user;
}

/**
 * Ensure user is authenticated, throw if not
 * Useful in server components and API routes
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User session not found");
  }
  return user;
}
