import {
  buildTopHeadlinesUrl,
  fetchTopHeadlines,
  NewsApiError,
} from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() || undefined
  const rawCategory = searchParams.get("category")?.trim() || undefined
  const country = searchParams.get("country")?.trim() || "us"
  const todayOnly = searchParams.get("today") !== "0"

  const allowedCategories = new Set([
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ])
  const category =
    rawCategory && allowedCategories.has(rawCategory) ? rawCategory : undefined

  try {
    const items = await fetchTopHeadlines({ query, category, country, todayOnly })
    return Response.json({ items })
  } catch (err) {
    console.error("GET /api/news failed", err)
    const url = new URL(request.url)
    const isLocalhost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    const isDev = process.env.NODE_ENV !== "production" || isLocalhost

    const endpoint = buildTopHeadlinesUrl({
      query,
      category,
      country,
      pageSize: 24,
    }).toString()
    const debug = isDev
      ? {
          endpoint,
          hasApiKey: Boolean(process.env.NEWS_API_KEY),
          baseUrl: process.env.NEWS_API_BASE_URL ?? "https://newsapi.org",
          nodeEnv: process.env.NODE_ENV ?? null,
        }
      : undefined

    if (err instanceof Error && err.message.includes("Missing NEWS_API_KEY")) {
      return Response.json(
        { error: isDev ? err.message : "Server misconfigured.", debug },
        { status: 500 },
      )
    }

    if (err instanceof NewsApiError) {
      const status =
        err.status === 429 ? 503 : err.status >= 500 ? 502 : 502

      const message = isDev
        ? err.status === 401 || err.status === 403
          ? `NewsAPI rejected the request (${err.status}). Check NEWS_API_KEY. ${err.message}`
          : `NewsAPI error (${err.status}). ${err.message}`
        : "Failed to fetch news right now. Please try again."

      return Response.json({ error: message, debug }, { status })
    }

    const message =
      err instanceof Error ? err.message : "Failed to fetch news right now."
    return Response.json(
      {
        error: isDev ? message : "Failed to fetch news right now. Please try again.",
        debug,
      },
      { status: 500 },
    )
  }
}
