"use client"

import Link from "next/link"
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"

export function AuthButton() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignUpButton mode="redirect" fallbackRedirectUrl="/onboarding">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-white/10 bg-black/25 px-4 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Create account
          </button>
        </SignUpButton>
        <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Sign in
          </button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pl-3 backdrop-blur-md">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-2 py-1 text-sm font-semibold text-zinc-200 opacity-100 transition hover:bg-white/10 hover:text-white hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:bg-white/15 active:text-white active:opacity-100 sm:inline-flex"
          >
            Dashboard
          </Link>
          <UserButton />
        </div>
      </Show>
    </div>
  )
}
