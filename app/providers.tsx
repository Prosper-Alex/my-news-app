"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { BookmarksProvider } from "@/components/bookmarks/bookmarks-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <BookmarksProvider>{children}</BookmarksProvider>
    </SessionProvider>
  )
}
