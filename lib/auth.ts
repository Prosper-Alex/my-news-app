import { auth, clerkClient } from "@clerk/nextjs/server";
import { toAppUser } from "@/lib/auth/user";

/**
 * Get the current user's session on the server
 * Use this in Server Components and API Routes
 */
export async function getCurrentSession() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const client = await clerkClient();
  const user = toAppUser(await client.users.getUser(userId));
  if (!user) {
    return null;
  }

  return { user };
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
