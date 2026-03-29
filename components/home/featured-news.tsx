/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import type { NewsItem } from "@/types/news"
import { createStoryHref, formatStoryDate } from "@/lib/news-utils"

type FeaturedNewsProps = {
  items: NewsItem[]
}

export function FeaturedNews({ items }: FeaturedNewsProps) {
  const featured = items.slice(0, 3)
  if (!featured.length) return null

  return (
    <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {featured.map((item, index) => (
        <article
          key={item.id}
          className={[
            "group relative overflow-hidden rounded-3xl border border-white/10",
            "bg-white/5 shadow-sm backdrop-blur-md transition",
            "hover:border-white/20 hover:bg-white/10",
            index === 0 ? "lg:col-span-2" : "",
          ].join(" ")}
        >
          <div className="absolute inset-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover opacity-35 transition group-hover:opacity-45"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-white/10 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="relative flex h-full flex-col justify-end p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Featured
            </div>

            <h2 className="mt-3 text-balance text-lg font-semibold leading-6 text-white">
              <Link
                href={createStoryHref(item)}
                className="line-clamp-2 underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </h2>

            {item.description ? (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-200">
                {item.description}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
              <span className="truncate rounded-full border border-white/10 bg-black/30 px-2 py-1">
                {item.sourceName}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1">
                {formatStoryDate(item.publishedAt)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={createStoryHref(item)}
                className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Open briefing
              </Link>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Visit publisher
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
