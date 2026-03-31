import type { Metadata } from "next";
import Link from "next/link";
import { fetchTopHeadlines } from "@/lib/api";
import { NewsPulse } from "@/components/home/news-pulse";
import { FeaturedNews } from "@/components/home/featured-news";
import { NewsGrid } from "@/components/news/news-grid";
import { SiteFrame } from "@/components/site/site-frame";
import { EmptyState } from "@/components/ui/empty-state";
import { extractTopics, getSourceBreakdown } from "@/lib/news-utils";
import type { NewsCategory } from "@/types/news";

type DiscoverPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const filters: Array<{
  key: NewsCategory;
  label: string;
  description: string;
}> = [
  {
    key: "all",
    label: "Top headlines",
    description: "The broadest daily view of the current feed.",
  },
  {
    key: "technology",
    label: "Technology",
    description: "Product launches, AI, platforms, and startup movement.",
  },
  {
    key: "business",
    label: "Business",
    description: "Markets, companies, deals, and economic coverage.",
  },
  {
    key: "sports",
    label: "Sports",
    description: "Fast-moving results, transfers, and big-match headlines.",
  },
  {
    key: "local",
    label: "Nigeria",
    description: "A local-first briefing powered by the Nigeria feed.",
  },
];

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function isNewsCategory(value?: string): value is NewsCategory {
  return filters.some((filter) => filter.key === value);
}

function getDiscoverHref(category: NewsCategory, query?: string) {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();
  return search ? `/discover?${search}` : "/discover";
}

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse category-led briefings and deeper news exploration.",
};

export default async function Page({ searchParams }: DiscoverPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = firstValue(resolvedSearchParams.q)?.trim() || undefined;
  const rawCategory = firstValue(resolvedSearchParams.category)?.trim();
  const category = isNewsCategory(rawCategory) ? rawCategory : "all";
  const activeFilter =
    filters.find((filter) => filter.key === category) ?? filters[0];
  const country = category === "local" ? "ng" : "us";
  const apiCategory =
    category === "all" || category === "local" ? undefined : category;

  const items = await fetchTopHeadlines({
    query,
    category: apiCategory,
    country,
    todayOnly: true,
    pageSize: 30,
  });

  const topics = extractTopics(items);
  const sources = getSourceBreakdown(items, 5);

  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div>
            <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
              Discover
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Browse the feed by desk, region, and live query.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              This page gives the app a scalable second surface beyond the
              homepage: focused coverage, topic pivots, and source concentration
              without losing the original headline grid.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="text-xs font-semibold tracking-[0.16em] text-amber-200 uppercase">
              Active desk
            </div>
            <div className="mt-3 text-xl font-semibold text-white">
              {activeFilter.label}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {query
                ? `Currently filtered by “${query}”. ${activeFilter.description}`
                : activeFilter.description}
            </p>
            {query ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                Showing discover results for{" "}
                <span className="font-semibold text-white">{query}</span>.
                <Link
                  href={getDiscoverHref(category)}
                  className="ml-2 font-semibold text-white underline-offset-4 hover:underline">
                  Clear query
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">
            Choose a desk
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filters.map((filter) => {
              const href = getDiscoverHref(filter.key, query);

              return (
                <Link
                  key={filter.key}
                  href={href}
                  className={[
                    "rounded-3xl border p-4 transition",
                    filter.key === category
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-black/20 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  aria-current={filter.key === category ? "page" : undefined}>
                  <div className="text-sm font-semibold">{filter.label}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {filter.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <NewsPulse items={items} label={activeFilter.label} compact />
        </div>

        {items.length ? (
          <>
            <div className="mt-8">
              <FeaturedNews items={items} />
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <NewsGrid items={items.slice(0, 12)} />
              </div>

              <aside className="space-y-5">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <div className="text-base font-semibold text-white">
                    Topic pivots
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Link
                        key={topic}
                        href={`/discover?q=${encodeURIComponent(topic)}`}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
                        {topic}
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <div className="text-base font-semibold text-white">
                    Source mix
                  </div>
                  <ul className="mt-3 space-y-3 text-sm text-zinc-300">
                    {sources.map((source) => (
                      <li
                        key={source.name}
                        className="flex items-center justify-between gap-3">
                        <span className="truncate">{source.name}</span>
                        <span className="text-zinc-400">{source.share}%</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No stories available"
              description="Try another desk or switch back to the homepage feed."
              action={
                <Link
                  href="/"
                  className="inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200">
                  Return home
                </Link>
              }
            />
          </div>
        )}
      </section>
    </SiteFrame>
  );
}
