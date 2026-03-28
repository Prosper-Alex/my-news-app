"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { NewsCategory, NewsItem } from "@/types/news"

type UseNewsState =
  | { status: "loading"; data: NewsItem[] | null; error: null }
  | { status: "success"; data: NewsItem[]; error: null }
  | { status: "error"; data: NewsItem[] | null; error: string }

export type UseNewsParams = {
  query?: string
  category?: NewsCategory
  country?: string
  todayOnly?: boolean
  initialData?: NewsItem[]
  refreshKey?: number
}

export function useNews({
  query,
  category,
  country = "us",
  todayOnly = true,
  initialData,
  refreshKey,
}: UseNewsParams) {
  const [state, setState] = useState<UseNewsState>(() =>
    initialData?.length
      ? { status: "success", data: initialData, error: null }
      : { status: "loading", data: null, error: null },
  )

  const didHydrate = useRef(false)

  const url = useMemo(() => {
    const params = new URLSearchParams()
    params.set("country", country)
    params.set("today", todayOnly ? "1" : "0")
    if (query?.trim()) params.set("q", query.trim())
    if (category && category !== "all" && category !== "local") {
      params.set("category", category)
    }
    return `/api/news?${params.toString()}`
  }, [category, country, query, todayOnly])

  useEffect(() => {
    // If we rendered with initialData, avoid a duplicate fetch on first paint.
    if (!didHydrate.current) {
      didHydrate.current = true
      if (initialData?.length) return
    }

    const controller = new AbortController()

    async function run() {
      setState((prev) => ({ status: "loading", data: prev.data, error: null }))

      try {
        const res = await fetch(url, { signal: controller.signal })
        const payload = (await res.json()) as
          | { items: NewsItem[] }
          | { error: string }

        if (!res.ok || "error" in payload) {
          throw new Error(
            "error" in payload ? payload.error : `Request failed (${res.status})`,
          )
        }

        setState({ status: "success", data: payload.items, error: null })
      } catch (err) {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Unknown error"
        setState((prev) => ({ status: "error", data: prev.data, error: message }))
      }
    }

    run()
    return () => controller.abort()
  }, [url, initialData, refreshKey])

  return state
}
