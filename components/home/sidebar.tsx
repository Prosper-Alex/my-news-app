"use client"

import { useSession } from "next-auth/react"
import { useBookmarks } from "@/components/bookmarks/bookmarks-provider"

type SidebarProps = {
  topics: string[]
  onTopicClick: (topic: string) => void
}

export function Sidebar({ topics, onTopicClick }: SidebarProps) {
  const { status } = useSession()
  const bookmarks = useBookmarks()
  const saved = bookmarks.state.items.slice(0, 4)

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-5">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200 backdrop-blur-md xl:p-6">
          <div className="text-base font-semibold text-white">Trending topics</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.length ? (
              topics.slice(0, 10).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onTopicClick(topic)}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  {topic}
                </button>
              ))
            ) : (
              <div className="text-zinc-300">No topics yet.</div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200 backdrop-blur-md xl:p-6">
          <div className="text-base font-semibold text-white">Saved</div>
          {bookmarks.state.status === "error" ? (
            <div className="mt-2 text-zinc-300">{bookmarks.state.error}</div>
          ) : null}

          {status !== "authenticated" ? (
            <div className="mt-2 text-zinc-300">
              Sign in to save articles and sync across devices.
            </div>
          ) : saved.length ? (
            <ul className="mt-3 space-y-3">
              {saved.map((b) => (
                <li key={b.id} className="text-sm">
                  <a
                    href={b.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-zinc-200 hover:text-white"
                  >
                    <div className="font-semibold">{b.title}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {b.sourceName ?? "Saved"}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-zinc-300">
              No saved articles yet. Tap “Save” on a story.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200 backdrop-blur-md xl:p-6">
          <div className="text-base font-semibold text-white">Suggested</div>
          <ul className="mt-3 space-y-2 text-zinc-300">
            <li>Technology</li>
            <li>Business</li>
            <li>Sports</li>
            <li>Local</li>
          </ul>
        </section>
      </div>
    </aside>
  )
}
