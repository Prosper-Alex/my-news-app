import type { Metadata } from "next"
import Link from "next/link"
import { SiteFrame } from "@/components/site/site-frame"

export const metadata: Metadata = {
  title: "About",
  description: "What MyNews is building and how the product is structured.",
}

export default function Page() {
  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
          About MyNews
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          A lightweight headline product with room to scale.
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
          MyNews starts with a fast headline feed, then layers on briefings,
          discover surfaces, and saved reading. The goal is a product that feels
          fuller than a single landing page without forcing a rewrite of the
          existing architecture.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">What changed</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              The app now uses more of each article record: author, read-time
              estimate, source domain, internal briefing pages, and route-based
              navigation.
            </p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Why it scales</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Homepage, discover, saved stories, and story briefings are now
              separate surfaces. That makes it easier to keep adding features
              without crowding a single page.
            </p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Where next</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              This structure is ready for future work like newsletters, alerts,
              personalized desks, richer analytics, or editorial curation.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/discover"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Explore discover
          </Link>
          <Link
            href="/saved"
            className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            View saved page
          </Link>
        </div>
      </section>
    </SiteFrame>
  )
}
