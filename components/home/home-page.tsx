"use client";

import { useMemo, useState } from "react";
import type { NewsCategory, NewsItem } from "@/types/news";
import { useNews } from "@/hooks/use-news";
import { FeaturedNews } from "@/components/home/featured-news";
import { CategoryTabs } from "@/components/home/category-tabs";
import { Sidebar } from "@/components/home/sidebar";
import { AskTheNews } from "@/components/home/ask-the-news";
import { NewsPulse } from "@/components/home/news-pulse";
import { QuickLinks } from "@/components/home/quick-links";
import { NewsGrid } from "@/components/news/news-grid";
import { SiteFrame } from "@/components/site/site-frame";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiConfigError } from "@/components/ui/api-config-error";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { Pagination } from "@/components/ui/pagination";
import { extractTopics } from "@/lib/news-utils";

type HomePageProps = {
  initialItems: NewsItem[];
};

export function HomePage({ initialItems }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | undefined>(
    undefined,
  );
  const [category, setCategory] = useState<NewsCategory>("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const country = category === "local" ? "ng" : "us";
  const apiCategory = category === "local" ? "all" : category;

  const useInitial =
    !submittedQuery && apiCategory === "all" && country === "us";

  const state = useNews({
    query: submittedQuery,
    category: apiCategory,
    country,
    todayOnly: true,
    initialData: useInitial ? initialItems : undefined,
    refreshKey,
  });

  const items = useMemo(() => state.data ?? [], [state.data]);
  const topics = useMemo(() => extractTopics(items), [items]);

  const audienceLabel = submittedQuery
    ? `Search results for “${submittedQuery}”`
    : category === "local"
      ? "Nigeria"
      : category === "all"
        ? "United States"
        : category[0].toUpperCase() + category.slice(1);

  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = items.slice(pageStart, pageStart + pageSize);
  const rangeStart = items.length ? pageStart + 1 : 0;
  const rangeEnd = Math.min(pageStart + pageSize, items.length);

  return (
    <SiteFrame
      query={query}
      onQueryChange={setQuery}
      onSearch={() => {
        const trimmed = query.trim();
        setSubmittedQuery(trimmed ? trimmed : undefined);
        setPage(1);
      }}
      onClear={() => {
        setQuery("");
        setSubmittedQuery(undefined);
        setPage(1);
      }}
      showSearch>
      <section className="mx-auto w-full max-w-screen-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
          <div className="space-y-6 lg:space-y-8">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
              <div>
                <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                  Daily briefing
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Top headlines, fast briefings, and scalable news discovery.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                  The homepage now does more than list stories. It highlights
                  live feed health, source density, quick navigation, and deeper
                  story pages without disrupting the existing search, category,
                  and bookmark flow.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md xl:p-6">
                <div className="text-xs font-semibold tracking-[0.16em] text-amber-200 uppercase">
                  Viewing now
                </div>
                <div className="mt-3 text-xl font-semibold text-white">
                  {audienceLabel}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {submittedQuery
                    ? "The feed is tuned to your search query while keeping the same modern layout."
                    : category === "local"
                      ? "Local mode shifts the feed to Nigeria while preserving the same saved and briefing experience."
                      : "Use discover pages, topic chips, and story briefings to move deeper into the feed."}
                </p>
              </div>
            </div>

            <NewsPulse items={items} label={audienceLabel} />

            <QuickLinks />

            <FeaturedNews items={items} />

            <AskTheNews
              onAsk={(intent) => {
                const nextQuery = intent.query ?? "";
                setCategory(intent.category);
                setQuery(nextQuery);
                setSubmittedQuery(nextQuery || undefined);
                setPage(1);
              }}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryTabs
                value={category}
                onChange={(next) => {
                  setCategory(next);
                  setSubmittedQuery(undefined);
                  setQuery("");
                  setPage(1);
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
                <div className="text-sm text-zinc-400">{audienceLabel}</div>
              )}
            </div>

            {state.status === "loading" && !state.data ? (
              <SkeletonLoader count={pageSize} />
            ) : null}

            {state.status === "error" && !state.data ? (
              state.error?.includes("not configured") ||
              state.error?.includes("NEWS_API_KEY") ? (
                <ApiConfigError hint={state.error} showSetupGuide={true} />
              ) : (
                <EmptyState
                  title="Couldn't load news"
                  description={state.error}
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setRefreshKey((current) => current + 1);
                      }}
                      className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200">
                      Retry
                    </button>
                  }
                />
              )
            ) : null}

            {state.status !== "loading" && state.data && !state.data.length ? (
              !submittedQuery && !initialItems.length ? (
                <ApiConfigError
                  hint="No news available. The API key may not be configured, or no results were found."
                  showSetupGuide={true}
                />
              ) : (
                <EmptyState
                  title="No results"
                  description="Try a different search term or switch categories."
                />
              )
            ) : null}

            {state.data?.length ? (
              <div className="space-y-6">
                <NewsGrid items={pageItems} />

                {items.length > pageSize ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-zinc-400">
                      Showing{" "}
                      <span className="font-semibold text-white">
                        {rangeStart}–{rangeEnd}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-white">
                        {items.length}
                      </span>
                    </div>
                    <Pagination
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <Sidebar
            topics={topics}
            onTopicClick={(topic) => {
              setCategory("all");
              setQuery(topic);
              setSubmittedQuery(topic);
              setPage(1);
            }}
          />
        </div>
      </section>
    </SiteFrame>
  );
}
