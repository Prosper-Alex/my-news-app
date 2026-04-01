"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function GitHubSignInButton({
  size = "md",
  fullWidth = false,
}: {
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("github", {
      redirectUrl: callbackUrl,
      redirect: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-lg bg-[#1F2937] font-semibold text-white hover:bg-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`}>
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Signing in…</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.556.636-1.913-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.192 20 14.444 20 10.017 20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Continue with GitHub</span>
        </>
      )}
    </button>
  );
}
