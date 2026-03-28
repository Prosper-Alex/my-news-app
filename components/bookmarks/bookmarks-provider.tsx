"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useSession } from "next-auth/react"
import type { Bookmark, CreateBookmarkInput } from "@/types/bookmarks"

type BookmarksState =
  | { status: "idle"; items: Bookmark[]; error: null }
  | { status: "loading"; items: Bookmark[]; error: null }
  | { status: "ready"; items: Bookmark[]; error: null }
  | { status: "error"; items: Bookmark[]; error: string }

type BookmarksContextValue = {
  state: BookmarksState
  isBookmarked: (articleUrl: string) => boolean
  refresh: () => Promise<void>
  add: (input: CreateBookmarkInput) => Promise<void>
  remove: (articleUrl: string) => Promise<void>
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [state, setState] = useState<BookmarksState>({
    status: "idle",
    items: [],
    error: null,
  })

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setState({ status: "idle", items: [], error: null })
      return
    }

    setState((prev) => ({ status: "loading", items: prev.items, error: null }))
    try {
      const res = await fetch("/api/bookmarks", { cache: "no-store" })
      const payload = (await res.json()) as
        | { items: Bookmark[] }
        | { error: string }
      if (!res.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : `Request failed (${res.status})`,
        )
      }
      setState({ status: "ready", items: payload.items, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setState((prev) => ({ status: "error", items: prev.items, error: message }))
    }
  }, [status])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isBookmarked = useCallback(
    (articleUrl: string) => state.items.some((b) => b.articleUrl === articleUrl),
    [state.items],
  )

  const add = useCallback(
    async (input: CreateBookmarkInput) => {
      if (status !== "authenticated") return

      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const payload = (await res.json()) as
        | { item: Bookmark }
        | { error: string }

      if (!res.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : `Request failed (${res.status})`,
        )
      }

      setState((prev) => {
        const nextItems = [payload.item, ...prev.items].filter(
          (b, i, arr) => arr.findIndex((x) => x.articleUrl === b.articleUrl) === i,
        )
        return { status: "ready", items: nextItems, error: null }
      })
    },
    [status],
  )

  const remove = useCallback(
    async (articleUrl: string) => {
      if (status !== "authenticated") return

      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleUrl }),
      })
      const payload = (await res.json()) as { ok: true } | { error: string }

      if (!res.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : `Request failed (${res.status})`,
        )
      }

      setState((prev) => ({
        status: "ready",
        items: prev.items.filter((b) => b.articleUrl !== articleUrl),
        error: null,
      }))
    },
    [status],
  )

  const value = useMemo<BookmarksContextValue>(
    () => ({ state, isBookmarked, refresh, add, remove }),
    [add, isBookmarked, refresh, remove, state],
  )

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider")
  return ctx
}

