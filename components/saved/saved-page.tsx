"use client"

import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useBookmarks } from "@/components/bookmarks/bookmarks-provider"
import { SiteFrame } from "@/components/site/site-frame"
import { EmptyState } from "@/components/ui/empty-state"
import { createStoryHref, formatStoryDate } from "@/lib/news-utils"

export function SavedPage() {
  const { status } = useSession()
  const bookmarks = useBookmarks()

  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
            Saved briefings
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A dedicated home for your reading queue.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
            Bookmarks now have their own page, so saved stories are not trapped
            in the sidebar. This gives the app a clearer path to scale into a
            fuller product.
          </p>
        </div>

        <div className="mt-8">
          {status === "loading" ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300 backdrop-blur-md">
              Loading your saved stories…
            </div>
          ) : null}

          {status !== "loading" && status !== "authenticated" ? (
            <EmptyState
              title="Sign in to view saved stories"
              description="Bookmarks sync through your account. Sign in first, then save any story from the homepage or discover page."
              action={
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => signIn("github")}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Sign in
                  </button>
                  <Link
                    href="/discover"
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    Explore discover
                  </Link>
                </div>
              }
            />
          ) : null}

          {status === "authenticated" && bookmarks.state.status === "error" ? (
            <EmptyState
              title="Couldn’t load bookmarks"
              description={bookmarks.state.error}
              action={
                <button
                  type="button"
                  onClick={() => void bookmarks.refresh()}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Retry
                </button>
              }
            />
          ) : null}

          {status === "authenticated" &&
          bookmarks.state.status !== "error" &&
          !bookmarks.state.items.length ? (
            <EmptyState
              title="No bookmarks yet"
              description="Save a story from any card to build your personal briefing queue."
              action={
                <Link
                  href="/discover"
                  className="inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Open discover page
                </Link>
              }
            />
          ) : null}

          {status === "authenticated" && bookmarks.state.items.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {bookmarks.state.items.map((bookmark) => (
                <article
                  key={bookmark.id}
                  className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                >
                  <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                    Saved story
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white">
                    <Link
                      href={createStoryHref({
                        title: bookmark.title,
                        url: bookmark.articleUrl,
                        imageUrl: bookmark.imageUrl,
                        sourceName: bookmark.sourceName,
                        publishedAt: bookmark.publishedAt,
                      })}
                      className="underline-offset-4 hover:underline"
                    >
                      {bookmark.title}
                    </Link>
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                      {bookmark.sourceName ?? "Publisher"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                      {formatStoryDate(bookmark.publishedAt)}
                    </span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Link
                      href={createStoryHref({
                        title: bookmark.title,
                        url: bookmark.articleUrl,
                        imageUrl: bookmark.imageUrl,
                        sourceName: bookmark.sourceName,
                        publishedAt: bookmark.publishedAt,
                      })}
                      className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                      Open briefing
                    </Link>
                    <a
                      href={bookmark.articleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                    >
                      Visit publisher
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </SiteFrame>
  )
}
