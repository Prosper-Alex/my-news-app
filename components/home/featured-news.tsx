/* eslint-disable @next/next/no-img-element */
"use client"

import type { NewsItem } from "@/types/news"

type FeaturedNewsProps = {
  items: NewsItem[]
}

export function FeaturedNews({ items }: FeaturedNewsProps) {
  const featured = items.slice(0, 3)
  if (!featured.length) return null

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {featured.map((item, index) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
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
                alt=""
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
              <span className="line-clamp-2">{item.title}</span>
            </h2>

            {item.description ? (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-200">
                {item.description}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-300">
              <span className="truncate">{item.sourceName}</span>
              <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1">
                Read
              </span>
            </div>
          </div>
        </a>
      ))}
    </section>
  )
}
