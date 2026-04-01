import type { NewsApiArticle, NewsApiResponse, NewsItem } from "@/types/news";
import { estimateReadTimeMinutes, getSourceDomain } from "@/lib/news-utils";

const DEFAULT_BASE_URL = "https://newsapi.org";
const NIGERIA_FALLBACK_DOMAINS = [
  "guardian.ng",
  "punchng.com",
  "vanguardngr.com",
  "channelstv.com",
  "businessday.ng",
  "leadership.ng",
  "thisdaylive.com",
  "premiumtimesng.com",
].join(",");

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

function buildNigeriaFallbackUrl(params: {
  query?: string;
  category?: string;
  pageSize: number;
}): URL {
  const baseUrl = process.env.NEWS_API_BASE_URL ?? DEFAULT_BASE_URL;
  const url = new URL(baseUrl);
  url.pathname = "/v2/everything";
  url.searchParams.set("domains", NIGERIA_FALLBACK_DOMAINS);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", String(params.pageSize));

  const fallbackCategoryQueries: Record<string, string> = {
    business: "business OR economy OR market OR bank OR finance",
    technology: "technology OR startup OR fintech OR telecom OR AI",
    sports: "sports OR football OR Super Eagles OR NPFL",
  };

  const query =
    params.query?.trim() ||
    (params.category?.trim()
      ? (fallbackCategoryQueries[params.category.trim()] ?? "")
      : "");

  if (query) {
    url.searchParams.set("q", query);
  }

  return url;
}

function toNewsItem(article: NewsApiArticle): NewsItem {
  const description = article.description ?? null;
  const content = article.content ?? null;

  return {
    id: article.url,
    title: article.title,
    description,
    url: article.url,
    imageUrl: article.urlToImage ?? null,
    sourceName: article.source.name,
    sourceId: article.source.id,
    sourceDomain: getSourceDomain(article.url),
    author: article.author ?? null,
    content,
    publishedAt: article.publishedAt,
    readTimeMinutes: estimateReadTimeMinutes(description, content),
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

async function fetchNewsItems(
  url: URL,
  apiKey: string,
  revalidate: number,
): Promise<NewsItem[]> {
  const isDev = process.env.NODE_ENV !== "production";
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

  return data.articles.map(toNewsItem);
}

export async function fetchTopHeadlines({
  query,
  category,
  country = "us",
  pageSize = 24,
  todayOnly = true,
}: FetchTopHeadlinesParams = {}): Promise<NewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  // During build/prerender, return empty array to prevent crashes
  // Validation happens at API route runtime
  if (!apiKey) {
    console.warn(
      "⚠️  NEWS_API_KEY not set. Running without news data. Set the environment variable to fetch live news.",
    );
    return [];
  }

  const url = buildTopHeadlinesUrl({ query, category, country, pageSize });
  const revalidate = query?.trim() || category?.trim() ? 60 : 300;
  const items = await fetchNewsItems(url, apiKey, revalidate);

  const shouldUseNigeriaFallback = country === "ng" && items.length === 0;
  const resolvedItems = shouldUseNigeriaFallback
    ? await fetchNewsItems(
        buildNigeriaFallbackUrl({ query, category, pageSize }),
        apiKey,
        revalidate,
      )
    : items;

  if (!todayOnly) return resolvedItems;

  const todayItems = resolvedItems.filter((item) =>
    isTodayUtc(item.publishedAt),
  );
  console.log(
    `Fetched ${resolvedItems.length} articles for ${country}${shouldUseNigeriaFallback ? " using Nigeria fallback" : ""}, ${todayItems.length} published today.`,
  );
  return todayItems.length ? todayItems : resolvedItems;
}
