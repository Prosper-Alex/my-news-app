/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import type { NewsItem } from "@/types/news"
import { BookmarkButton } from "@/components/bookmarks/bookmark-button"
import { createStoryHref, formatStoryDate } from "@/lib/news-utils"

type NewsCardProps = {
  item: NewsItem
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_18px_50px_-25px_rgba(56,189,248,0.55)]">
      <div className="mb-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
        {item.imageUrl ? (
          // Use <img> to avoid configuring `next/image` remotePatterns in the starter.
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="h-48 w-full object-cover opacity-95 transition duration-200 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        )}
      </div>

      <h3 className="text-pretty text-base font-semibold leading-6 text-white">
        <Link
          href={createStoryHref(item)}
          className="line-clamp-2 underline-offset-4 hover:underline"
        >
          {item.title}
        </Link>
      </h3>

      {item.description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-200">
          {item.description}
        </p>
      ) : (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
          No description available.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
        {item.author ? (
          <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
            By {item.author}
          </span>
        ) : null}
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
          {item.sourceDomain}
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
          {item.readTimeMinutes} min read
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-300">
        <time className="truncate" dateTime={item.publishedAt}>
          {formatStoryDate(item.publishedAt)}
        </time>
        <div className="flex min-w-0 items-center gap-2">
          <span className="max-w-[11rem] truncate rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs font-semibold text-zinc-200">
            {item.sourceName}
          </span>
          <BookmarkButton item={item} />
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={createStoryHref(item)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Open briefing
          </Link>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Read publisher story
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  )
}
