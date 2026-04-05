"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Bookmark, CreateBookmarkInput } from "@/types/bookmarks"
import { api, getApiErrorMessage } from "@/lib/client/api"

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
  const { isLoaded, isSignedIn, userId } = useAuth()
  const queryClient = useQueryClient()
  const enabled = isLoaded && isSignedIn
  const queryKey = ["bookmarks", userId] as const

  const bookmarksQuery = useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      try {
        const res = await api.get<{ items: Bookmark[] }>("/bookmarks")
        return res.data.items
      } catch (err) {
        throw new Error(getApiErrorMessage(err))
      }
    },
    staleTime: 0,
  })

  const addMutation = useMutation({
    mutationFn: async (input: CreateBookmarkInput) => {
      try {
        const res = await api.post<{ item: Bookmark }>("/bookmarks", input)
        return res.data.item
      } catch (err) {
        throw new Error(getApiErrorMessage(err))
      }
    },
    onSuccess: (item) => {
      queryClient.setQueryData(queryKey, (prev: Bookmark[] | undefined) => {
        const nextItems = [item, ...(prev ?? [])].filter(
          (b, i, arr) => arr.findIndex((x) => x.articleUrl === b.articleUrl) === i,
        )
        return nextItems
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (articleUrl: string) => {
      try {
        await api.delete("/bookmarks", {
          data: { articleUrl },
        })
      } catch (err) {
        throw new Error(getApiErrorMessage(err))
      }
    },
    onSuccess: (_data, articleUrl) => {
      queryClient.setQueryData(queryKey, (prev: Bookmark[] | undefined) =>
        (prev ?? []).filter((b) => b.articleUrl !== articleUrl),
      )
    },
  })

  const isBookmarked = useCallback(
    (articleUrl: string) =>
      (bookmarksQuery.data ?? []).some((b) => b.articleUrl === articleUrl),
    [bookmarksQuery.data],
  )

  const add = useCallback(
    async (input: CreateBookmarkInput) => {
      if (!enabled) return
      await addMutation.mutateAsync(input)
    },
    [addMutation, enabled],
  )

  const remove = useCallback(
    async (articleUrl: string) => {
      if (!enabled) return
      await removeMutation.mutateAsync(articleUrl)
    },
    [enabled, removeMutation],
  )

  const refresh = useCallback(async () => {
    if (!enabled) return
    await bookmarksQuery.refetch()
  }, [bookmarksQuery, enabled])

  const state = useMemo<BookmarksState>(() => {
    if (!isLoaded) {
      return { status: "loading", items: [], error: null }
    }

    if (!enabled) {
      return { status: "idle", items: [], error: null }
    }

    const items = bookmarksQuery.data ?? []
    const busy =
      bookmarksQuery.fetchStatus === "fetching" ||
      addMutation.isPending ||
      removeMutation.isPending

    if (bookmarksQuery.isError) {
      const message =
        bookmarksQuery.error instanceof Error
          ? bookmarksQuery.error.message
          : "Unknown error"
      return { status: "error", items, error: message }
    }

    if (bookmarksQuery.isPending || busy) {
      return { status: "loading", items, error: null }
    }

    return { status: "ready", items, error: null }
  }, [
    addMutation.isPending,
    bookmarksQuery.data,
    bookmarksQuery.error,
    bookmarksQuery.fetchStatus,
    bookmarksQuery.isError,
    bookmarksQuery.isPending,
    enabled,
    isLoaded,
    removeMutation.isPending,
  ])

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
