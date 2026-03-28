/* eslint-disable @next/next/no-img-element */
"use client"

import type { NewsItem } from "@/types/news"
import { BookmarkButton } from "@/components/bookmarks/bookmark-button"

type NewsCardProps = {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  const published = new Date(item.publishedAt)
  const publishedLabel = Number.isNaN(published.getTime())
    ? "Unknown date"
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(published)

  const showReadMore = (item.description?.trim().length ?? 0) > 160

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_50px_-25px_rgba(56,189,248,0.55)]">
      <div className="mb-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
        {item.imageUrl ? (
          // Use <img> to avoid configuring `next/image` remotePatterns in the starter.
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className="h-48 w-full object-cover opacity-95 transition duration-200 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
      </div>

      <h3 className="text-pretty text-base font-semibold leading-6 text-white">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 hover:underline"
        >
          {item.title}
        </a>
      </h3>

      {item.description ? (
        <div className="mt-2">
          <p className="line-clamp-3 text-sm leading-6 text-zinc-200">
            {item.description}
          </p>
          {showReadMore ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-xs font-semibold text-zinc-200 underline-offset-4 hover:text-white hover:underline"
            >
              Read more
            </a>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
          No description available.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-300">
        <time className="truncate" dateTime={item.publishedAt}>
          {publishedLabel}
        </time>
        <div className="flex min-w-0 items-center gap-2">
          <span className="max-w-[11rem] truncate rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs font-semibold text-zinc-200">
            {item.sourceName}
          </span>
          <BookmarkButton item={item} />
        </div>
      </div>

      <div className="mt-auto pt-4">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
        >
          Read full story
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  )
}
