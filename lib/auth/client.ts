"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { toAppUser } from "@/lib/auth/user"

export function useAppSession() {
  const auth = useAuth()
  const clerkUser = useUser()

  if (!auth.isLoaded || !clerkUser.isLoaded) {
    return {
      status: "loading" as const,
      user: null,
      session: null,
    }
  }

  if (!auth.isSignedIn || !clerkUser.user) {
    return {
      status: "unauthenticated" as const,
      user: null,
      session: null,
    }
  }

  const user = toAppUser(clerkUser.user)

  return {
    status: "authenticated" as const,
    user,
    session: user ? { user } : null,
  }
}

export function buildSignInUrl(returnBackUrl?: string) {
  if (!returnBackUrl) {
    return "/login"
  }

  const params = new URLSearchParams({ redirect_url: returnBackUrl })
  return `/login?${params.toString()}`
}

export function buildSignUpUrl(returnBackUrl?: string) {
  if (!returnBackUrl) {
    return "/register"
  }

  const params = new URLSearchParams({ redirect_url: returnBackUrl })
  return `/register?${params.toString()}`
}
