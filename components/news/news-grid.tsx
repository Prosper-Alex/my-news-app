"use client"

import type { NewsItem } from "@/types/news"
import { NewsCard } from "@/components/news/news-card"

type NewsGridProps = {
  items: NewsItem[]
}

export function NewsGrid({ items }: NewsGridProps) {
  return (
    <div className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
