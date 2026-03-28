"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function AuthButton() {
  const { status, data } = useSession()

  if (status === "loading") {
    return (
      <button
        type="button"
        disabled
        className="h-9 rounded-lg bg-zinc-200 px-3 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        Loading…
      </button>
    )
  }

  if (status === "authenticated") {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="h-9 rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Sign out {data.user?.name ? `(${data.user.name})` : ""}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => signIn("github")}
      className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
    >
      Sign in
    </button>
  )
}

