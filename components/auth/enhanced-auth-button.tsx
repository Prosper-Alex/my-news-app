"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserProfile } from "./user-profile";
import { useAppSession } from "@/lib/auth/client";

export function EnhancedAuthButton() {
  const { status, user } = useAppSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-zinc-400">Loading…</span>
      </div>
    );
  }

  if (status === "authenticated" && user) {
    return (
      <div className="flex items-center gap-3">
        <UserProfile user={user} />
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="rounded-lg bg-red-900/20 px-3 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-900/30"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
    >
      Sign in
    </Link>
  );
}
