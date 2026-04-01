"use client"

import type { NewsItem } from "@/types/news"
import { getNewsPulse, getSourceBreakdown } from "@/lib/news-utils"

type NewsPulseProps = {
  items: NewsItem[]
  label: string
  compact?: boolean
}

export function NewsPulse({ items, label, compact = false }: NewsPulseProps) {
  const pulse = getNewsPulse(items)
  const sources = getSourceBreakdown(items)

  const stats = [
    {
      label: "Stories in view",
      value: pulse.totalStories,
      detail: `Fresh coverage for ${label}`,
    },
    {
      label: "Active sources",
      value: pulse.sourceCount,
      detail: "Distinct publishers in the current feed",
    },
    {
      label: "Visual stories",
      value: pulse.withImages,
      detail: "Articles with images available",
    },
    {
      label: "Average read",
      value: `${pulse.averageReadTime} min`,
      detail: "Estimated skim time per story",
    },
  ]

  return (
    <section className={compact ? "grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]" : "space-y-4"}>
      <div
        className={[
          "grid grid-cols-1 gap-4 sm:grid-cols-2",
          compact ? "xl:grid-cols-2" : "xl:grid-cols-2",
        ].join(" ")}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md xl:min-h-[184px]"
          >
            <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
              {stat.label}
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md xl:p-6">
        <div className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
          Source Radar
        </div>
        <div className="mt-2 text-lg font-semibold text-white">
          Top desks driving this feed
        </div>
        <div className="mt-4 space-y-3">
          {sources.length ? (
            sources.map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-zinc-100">
                    {source.name}
                  </span>
                  <span className="text-zinc-400">{source.count} stories</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-300"
                    style={{ width: `${Math.max(source.share, 8)}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-300">
              Source coverage will appear once stories load.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
