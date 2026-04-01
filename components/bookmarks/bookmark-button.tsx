"use client"

import { signIn } from "next-auth/react"
import type { NewsItem } from "@/types/news"
import { useBookmarks } from "@/components/bookmarks/bookmarks-provider"

type BookmarkButtonProps = {
  item: NewsItem
}

export function BookmarkButton({ item }: BookmarkButtonProps) {
  const { state, isBookmarked, add, remove } = useBookmarks()

  const saved = isBookmarked(item.url)
  const disabled = state.status === "loading"

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        try {
          if (saved) {
            await remove(item.url)
            return
          }

          // If auth is not configured yet, signIn will fail silently; we still
          // keep the UX straightforward.
          if (state.status === "idle") {
            await signIn("github")
            return
          }

          await add({
            articleUrl: item.url,
            title: item.title,
            imageUrl: item.imageUrl,
            sourceName: item.sourceName,
            publishedAt: item.publishedAt,
          })
        } catch {
          // Keep it lightweight: UI stays responsive; errors surface in sidebar.
        }
      }}
      className={[
        "inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-xs font-semibold backdrop-blur-md transition",
        saved
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/20"
          : "border-white/10 bg-black/30 text-zinc-200 hover:border-white/20 hover:bg-white/10",
        disabled ? "opacity-60" : "",
      ].join(" ")}
      aria-label={saved ? "Remove bookmark" : "Save bookmark"}
      title={saved ? "Saved" : "Save"}
    >
      {saved ? "Saved" : "Save"}
    </button>
  )
}

