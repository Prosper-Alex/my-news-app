"use client"

import { useMemo, useState } from "react"
import type { NewsCategory, NewsItem } from "@/types/news"
import { useNews } from "@/hooks/use-news"
import { Navbar } from "@/components/home/navbar"
import { FeaturedNews } from "@/components/home/featured-news"
import { CategoryTabs } from "@/components/home/category-tabs"
import { Sidebar } from "@/components/home/sidebar"
import { Footer } from "@/components/home/footer"
import { AskTheNews } from "@/components/home/ask-the-news"
import { NewsGrid } from "@/components/news/news-grid"
import { EmptyState } from "@/components/ui/empty-state"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"

function extractTopics(items: NewsItem[]): string[] {
  const stop = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "from",
    "at",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "by",
    "new",
    "today",
    "latest",
  ])

  const counts = new Map<string, number>()
  for (const item of items) {
    const tokens = item.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => t.length >= 4 && !stop.has(t))

    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t)
}

type HomePageProps = {
  initialItems: NewsItem[]
}

export function HomePage({ initialItems }: HomePageProps) {
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>(
    undefined,
  )
  const [category, setCategory] = useState<NewsCategory>("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const country = category === "local" ? "ng" : "us"
  const apiCategory = category === "local" ? "all" : category

  const useInitial =
    !submittedQuery && apiCategory === "all" && country === "us"

  const state = useNews({
    query: submittedQuery,
    category: apiCategory,
    country,
    todayOnly: true,
    initialData: useInitial ? initialItems : undefined,
    refreshKey,
  })

  const items = useMemo(() => state.data ?? [], [state.data])

  const topics = useMemo(() => extractTopics(items), [items])

  return (
    <div className="min-h-full bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(1000px_circle_at_80%_0%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(900px_circle_at_40%_100%,rgba(16,185,129,0.16),transparent_45%)] bg-black text-white">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onSearch={() => {
          const trimmed = query.trim()
          setSubmittedQuery(trimmed ? trimmed : undefined)
        }}
        onClear={() => {
          setQuery("")
          setSubmittedQuery(undefined)
        }}
      />

      <main className="mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Top Headlines
                </h1>
                <p className="mt-2 text-sm text-zinc-300">
                  Trending stories, curated by category — and searchable.
                </p>
              </div>
            </div>

            <FeaturedNews items={items} />

            <AskTheNews
              onAsk={(q) => {
                setCategory("all")
                setQuery(q)
                setSubmittedQuery(q)
              }}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryTabs
                value={category}
                onChange={(next) => {
                  setCategory(next)
                  setSubmittedQuery(undefined)
                  setQuery("")
                }}
              />
              {submittedQuery ? (
                <div className="text-sm text-zinc-300">
                  Results for{" "}
                  <span className="font-semibold text-white">
                    {submittedQuery}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-zinc-400">
                  {category === "local" ? "Nigeria" : "United States"}
                </div>
              )}
            </div>

            {state.status === "loading" && !state.data ? <SkeletonLoader /> : null}

            {state.status === "error" && !state.data ? (
              <EmptyState
                title="Couldn’t load news"
                description={state.error}
                action={
                  <button
                    type="button"
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
                  >
                    Retry
                  </button>
                }
              />
            ) : null}

            {state.status !== "loading" && state.data && !state.data.length ? (
              <EmptyState
                title="No results"
                description="Try a different search term or switch categories."
              />
            ) : null}

            {state.data?.length ? <NewsGrid items={state.data} /> : null}
          </div>

          <Sidebar
            topics={topics}
            onTopicClick={(topic) => {
              setQuery(topic)
              setSubmittedQuery(topic)
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
