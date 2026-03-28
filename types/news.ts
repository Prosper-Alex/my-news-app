export type NewsApiSource = {
  id: string | null
  name: string
}

export type NewsApiArticle = {
  source: NewsApiSource
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export type NewsApiResponse = {
  status: "ok" | "error"
  totalResults?: number
  articles?: NewsApiArticle[]
  code?: string
  message?: string
}

export type NewsItem = {
  id: string
  title: string
  description: string | null
  url: string
  imageUrl: string | null
  sourceName: string
  publishedAt: string
}

export type NewsCategory =
  | "all"
  | "technology"
  | "business"
  | "sports"
  | "local"
