import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BookmarkButton } from "@/components/bookmarks/bookmark-button"
import { SiteFrame } from "@/components/site/site-frame"
import {
  formatStoryDate,
  getStoryTopicLinks,
  readStoryFromSearchParams,
} from "@/lib/news-utils"

type StoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  searchParams,
}: StoryPageProps): Promise<Metadata> {
  const story = await readStoryFromSearchParams(searchParams)

  if (!story) {
    return {
      title: "Story Briefing",
      description: "A news briefing built from the current feed.",
    }
  }

  return {
    title: `${story.title} | Story Briefing`,
    description:
      story.description ?? "A news briefing built from the current feed.",
  }
}

export default async function Page({ searchParams }: StoryPageProps) {
  const story = await readStoryFromSearchParams(searchParams)

  if (!story) {
    notFound()
  }

  const topics = getStoryTopicLinks(story)
  const storyItem = {
    id: story.url,
    title: story.title,
    description: story.description ?? null,
    url: story.url,
    imageUrl: story.imageUrl ?? null,
    sourceName: story.sourceName ?? story.sourceDomain ?? "Publisher",
    sourceId: story.sourceId ?? null,
    sourceDomain: story.sourceDomain ?? "publisher",
    author: story.author ?? null,
    content: story.content ?? null,
    publishedAt: story.publishedAt ?? new Date().toISOString(),
    readTimeMinutes: story.readTimeMinutes ?? 1,
  }

  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
            {story.imageUrl ? (
              <div
                className="h-72 w-full bg-cover bg-center sm:h-96"
                style={{ backgroundImage: `url(${story.imageUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div className="h-56 w-full bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.28),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)] sm:h-72" />
            )}

            <div className="p-6 sm:p-8">
              <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
                Story briefing
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {story.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                  {story.sourceName ?? story.sourceDomain}
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                  {formatStoryDate(story.publishedAt)}
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                  {story.readTimeMinutes ?? 1} min read
                </span>
                {story.author ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">
                    By {story.author}
                  </span>
                ) : null}
              </div>

              {story.description ? (
                <p className="mt-6 text-base leading-8 text-zinc-200">
                  {story.description}
                </p>
              ) : null}

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-zinc-300">
                {story.content ?? story.description ?? (
                  <>
                    This briefing uses the article metadata available in the
                    feed. Open the publisher story for the complete report and
                    source context.
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Visit publisher
                </a>
                <Link
                  href="/discover"
                  className="inline-flex rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  More briefings
                </Link>
                <BookmarkButton item={storyItem} />
              </div>
            </div>
          </article>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="text-base font-semibold text-white">Publisher</div>
              <div className="mt-3 text-sm text-zinc-300">
                <div className="font-medium text-white">
                  {story.sourceName ?? "Original source"}
                </div>
                <div className="mt-1">{story.sourceDomain}</div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="text-base font-semibold text-white">Topic links</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {topics.length ? (
                  topics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/discover?q=${encodeURIComponent(topic)}`}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      {topic}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-zinc-300">
                    Topic links appear when the headline has enough signal.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
              <div className="text-base font-semibold text-white">How this page works</div>
              <p className="mt-3">
                This internal page turns a feed item into a quick briefing. It
                keeps users inside the product longer, then hands off to the
                publisher when they want the full article.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </SiteFrame>
  )
}
