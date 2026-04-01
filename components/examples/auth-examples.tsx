"use client";

/**
 * EXAMPLE: Complete Authentication Usage Examples
 *
 * This file demonstrates how to use all the authentication features
 * in your Next.js app. Copy and adapt these patterns to your needs.
 */

import { useSession, signIn, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { EnhancedAuthButton } from "@/components/auth/enhanced-auth-button";
import { UserProfile } from "@/components/auth/user-profile";
import { useState, useTransition } from "react";

/**
 * EXAMPLE 1: Simple Session Display
 * Show current user info
 */
export function Example1_SimpleSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingSpinner />;
  if (status === "unauthenticated") return <p>Not signed in</p>;

  return (
    <div>
      <p>Hello, {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
    </div>
  );
}

/**
 * EXAMPLE 2: Sign In Button with Error Handling
 */
export function Example2_SignInWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(async () => {
      try {
        const result = await signIn("github", {
          redirectUrl: "/dashboard",
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        }
      } catch (err) {
        setError("An error occurred during sign in");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={handleSignIn}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}

/**
 * EXAMPLE 3: Protected Component with Toast
 */
export function Example3_ProtectedWithToast() {
  const { data: session, status } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      addToast("Signing out...", "info");
      await signOut({ redirectUrl: "/" });
    });
  };

  if (status === "unauthenticated") {
    return (
      <div>
        <p>You need to sign in to access this content</p>
        <GitHubSignInButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UserProfile session={session} />
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50">
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}

/**
 * EXAMPLE 4: Conditional Rendering Based on Auth Status
 */
export function Example4_ConditionalRendering() {
  const { status } = useSession();

  return (
    <div>
      {status === "loading" && (
        <div className="flex gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading session...</span>
        </div>
      )}

      {status === "authenticated" && (
        <div>
          <EnhancedAuthButton />
        </div>
      )}

      {status === "unauthenticated" && (
        <div>
          <GitHubSignInButton size="md" fullWidth />
        </div>
      )}
    </div>
  );
}

/**
 * EXAMPLE 5: Fetching Protected API
 */
export function Example5_ProtectedAPI() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    try {
      const response = await fetch("/api/user");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - please sign in again");
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") {
    return <p>Please sign in first</p>;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={fetchUserData}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
        {loading ? "Loading..." : "Fetch User Data"}
      </button>

      {error && <div className="text-red-500">{error}</div>}

      {userData && (
        <div className="text-green-500">
          <p>User ID: {userData.id}</p>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
}

/**
 * EXAMPLE 6: Update User Preferences via API
 */
export function Example6_UpdatePreferences() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSavePreferences = (preferences: Record<string, unknown>) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });

        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }

        addToast("Preferences saved!", "success");
      } catch (error) {
        addToast(
          error instanceof Error ? error.message : "Error saving preferences",
          "error",
        );
      }
    });
  };

  return (
    <button
      onClick={() =>
        handleSavePreferences({
          categories: ["technology", "business"],
          theme: "dark",
        })
      }
      disabled={isPending || !session}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
      {isPending ? "Saving..." : "Save Preferences"}
    </button>
  );
}

/**
 * EXAMPLE 7: Header Component with Auth
 */
export function Example7_HeaderComponent() {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <h1>News App</h1>

      {status === "loading" ? (
        <LoadingSpinner size="sm" />
      ) : (
        <EnhancedAuthButton />
      )}
    </header>
  );
}

/**
 * USAGE INSTRUCTIONS:
 *
 * 1. Import these components into your pages:
 *    import { Example1_SimpleSession } from "@/components/examples/auth-examples.tsx"
 *
 * 2. Use them in your JSX:
 *    <Example1_SimpleSession />
 *
 * 3. Customize as needed for your use case
 *
 * 4. For production, create your own components based on these patterns
 */
