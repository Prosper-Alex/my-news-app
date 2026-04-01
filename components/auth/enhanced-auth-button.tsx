"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserProfile } from "./user-profile";
import { useTransition } from "react";

export function EnhancedAuthButton() {
  const { status, data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  if (status === "loading" || isPending) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-zinc-400">Loading…</span>
      </div>
    );
  }

  if (status === "authenticated" && session) {
    return (
      <div className="flex items-center gap-3">
        <UserProfile session={session} />
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              await signOut({ redirect: true, redirectUrl: "/" });
            })
          }
          className="rounded-lg bg-red-900/20 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/30 transition-colors">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await signIn("github", { redirectUrl: "/dashboard" });
        })
      }
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">
      Sign in with GitHub
    </button>
  );
}
