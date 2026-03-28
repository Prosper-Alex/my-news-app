"use client"

import { useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { NewsCategory, NewsItem } from "@/types/news"
import { api, getApiErrorMessage } from "@/lib/client/api"

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
}: UseNewsParams): UseNewsState {
  const trimmedQuery = query?.trim() || ""
  const apiCategory =
    category && category !== "all" && category !== "local" ? category : ""

  const params = useMemo(() => {
    const next: Record<string, string> = {
      country,
      today: todayOnly ? "1" : "0",
    }
    if (trimmedQuery) next.q = trimmedQuery
    if (apiCategory) next.category = apiCategory
    return next
  }, [apiCategory, country, todayOnly, trimmedQuery])

  const queryKey = useMemo(
    () => ["news", country, todayOnly ? 1 : 0, trimmedQuery, apiCategory] as const,
    [apiCategory, country, todayOnly, trimmedQuery],
  )

  const staleTime =
    trimmedQuery || apiCategory ? 60 * 1000 : 5 * 60 * 1000

  const res = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.get<{ items: NewsItem[] }>("/news", {
          params,
        })
        return response.data.items
      } catch (err) {
        throw new Error(getApiErrorMessage(err))
      }
    },
    initialData: initialData?.length ? initialData : undefined,
    staleTime,
  })

  const refetch = res.refetch

  useEffect(() => {
    if (!refreshKey) return
    void refetch()
  }, [refreshKey, refetch])

  if (res.isPending) {
    return { status: "loading", data: null, error: null }
  }

  if (res.isError) {
    const message = res.error instanceof Error ? res.error.message : "Unknown error"
    return { status: "error", data: res.data ?? null, error: message }
  }

  return {
    status: res.fetchStatus === "fetching" ? "loading" : "success",
    data: res.data,
    error: null,
  }
}
