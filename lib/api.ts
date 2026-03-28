import type { NewsApiArticle, NewsApiResponse, NewsItem } from "@/types/news";

const DEFAULT_BASE_URL = "https://newsapi.org";

export class NewsApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "NewsApiError";
    this.status = status;
    this.code = code;
  }
}

export type FetchTopHeadlinesParams = {
  query?: string;
  category?: string;
  country?: string;
  pageSize?: number;
  todayOnly?: boolean;
};

export function buildTopHeadlinesUrl(params: {
  query?: string;
  category?: string;
  country: string;
  pageSize: number;
}): URL {
  const baseUrl = process.env.NEWS_API_BASE_URL ?? DEFAULT_BASE_URL;
  const url = new URL(baseUrl);
  url.pathname = "/v2/top-headlines";
  if (params.query?.trim()) {
    url.searchParams.set("q", params.query.trim());
  }
  if (params.category?.trim()) {
    url.searchParams.set("category", params.category.trim());
  }
  url.searchParams.set("country", params.country);
  url.searchParams.set("pageSize", String(params.pageSize));
  return url;
}

function toNewsItem(article: NewsApiArticle): NewsItem {
  return {
    id: article.url,
    title: article.title,
    description: article.description ?? null,
    url: article.url,
    imageUrl: article.urlToImage ?? null,
    sourceName: article.source.name,
    publishedAt: article.publishedAt,
  };
}

function isTodayUtc(isoDate: string, now = new Date()): boolean {
  const published = new Date(isoDate);
  if (Number.isNaN(published.getTime())) return false;
  return (
    published.getUTCFullYear() === now.getUTCFullYear() &&
    published.getUTCMonth() === now.getUTCMonth() &&
    published.getUTCDate() === now.getUTCDate()
  );
}

export async function fetchTopHeadlines({
  query,
  category,
  country = "us",
  pageSize = 24,
  todayOnly = true,
}: FetchTopHeadlinesParams = {}): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("Missing NEWS_API_KEY environment variable.");

  const url = buildTopHeadlinesUrl({ query, category, country, pageSize });

  const isDev = process.env.NODE_ENV !== "production";
  const revalidate = query?.trim() || category?.trim() ? 60 : 300;

  const res = await fetch(url, {
    headers: { "X-Api-Key": apiKey },
    cache: isDev ? "no-store" : "force-cache",
    next: isDev ? undefined : { revalidate },
  });

  const data = (await res.json()) as NewsApiResponse;

  if (!res.ok) {
    throw new NewsApiError(
      res.status,
      data.message ?? `NewsAPI request failed (${res.status}).`,
      data.code,
    );
  }

  if (data.status !== "ok" || !data.articles) {
    throw new NewsApiError(
      502,
      data.message ?? "NewsAPI returned an error.",
      data.code,
    );
  }

  const items = data.articles.map(toNewsItem);
  if (!todayOnly) return items;

  const todayItems = items.filter((item) => isTodayUtc(item.publishedAt));
  return todayItems.length ? todayItems : items;
}
