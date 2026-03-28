"use client"

import type { NewsCategory } from "@/types/news"

const tabs: Array<{ key: NewsCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "technology", label: "Tech" },
  { key: "business", label: "Business" },
  { key: "sports", label: "Sports" },
  { key: "local", label: "Local" },
]

type CategoryTabsProps = {
  value: NewsCategory
  onChange: (value: NewsCategory) => void
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.key === value
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              "border backdrop-blur-md",
              active
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
