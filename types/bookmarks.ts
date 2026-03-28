export type Bookmark = {
  id: string
  articleUrl: string
  title: string
  imageUrl: string | null
  sourceName: string | null
  publishedAt: string | null
  createdAt: string
}

export type CreateBookmarkInput = {
  articleUrl: string
  title: string
  imageUrl?: string | null
  sourceName?: string | null
  publishedAt?: string | null
}

