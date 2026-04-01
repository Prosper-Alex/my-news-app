"use client";

import { useEffect, useRef, useState } from "react";
import type { NewsItem } from "@/types/news";

type NewsFeedProps = {
  apiPath?: string;
  pageSize?: number;
  refreshThreshold?: number;
  page?: number;
  onPageChange?: (n: number) => void;
};

export default function NewsFeed({
  apiPath = "/api/news",
  pageSize = 10,
  refreshThreshold = 15,
  page: controlledPage,
  onPageChange,
}: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const inFlightRef = useRef(false);

  const pageToFetch = controlledPage ?? 1;

  const fetchNews = async (pageNumber = 1) => {
    if (loading || inFlightRef.current) return;
    setLoading(true);
    inFlightRef.current = true;

    try {
      const url = `${apiPath}?page=${pageNumber}&pageSize=${pageSize}&t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const items: NewsItem[] = data?.articles ?? [];

      // replace list with the requested page
      setNews(items);
      console.log("NewsFeed fetched page", pageNumber, "items:", items.length);

      if (!items.length || items.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error("NewsFeed fetch error:", err);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    fetchNews(pageToFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageToFetch]);

  const handleRefresh = () => {
    if (onPageChange) onPageChange(1);
    setHasMore(true);
    fetchNews(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live feed</h2>
        {news.length >= refreshThreshold ? (
          <button
            onClick={handleRefresh}
            className="rounded-2xl bg-white px-3 py-1 text-sm font-semibold text-black hover:bg-zinc-200">
            See More
          </button>
        ) : null}
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <article
            key={item.url || (item as any).id || item.title}
            className="rounded-md border border-white/6 bg-white/3 p-4">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="block">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 text-xs text-zinc-300">{item.description}</p>
              ) : null}
            </a>
          </article>
        ))}

        {loading ? (
          <div className="text-sm text-zinc-300">Loading...</div>
        ) : null}

        {!hasMore && !loading && news.length ? (
          <div className="text-sm text-zinc-400">
            You’ve reached the end of the feed.
          </div>
        ) : null}

        {news.length === 0 && !loading ? (
          <div className="text-sm text-zinc-300">No news available.</div>
        ) : null}
      </div>
    </div>
  );
}
