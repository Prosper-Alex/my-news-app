"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GitHubSignInButton } from "@/components/auth/github-signin-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RegisterPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/onboarding");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="text-zinc-400">Join thousands reading news their way</p>
        </div>

        {/* Registration Form Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md space-y-6">
          {/* GitHub Sign Up */}
          <div className="space-y-4">
            <GitHubSignInButton size="lg" fullWidth />
            <p className="text-xs text-center text-zinc-400">
              No password needed. One-click registration with GitHub.
            </p>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-green-900/20 p-4 border border-green-500/20">
            <ul className="space-y-2 text-sm text-green-200">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Fast setup, no form filling</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Your GitHub profile synced</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Complete profile on next step</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-white hover:text-zinc-200 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-zinc-500">
          We value your privacy. Read our{" "}
          <a
            href="/privacy"
            className="text-zinc-300 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
