import type { Metadata } from "next"
import { SiteFrame } from "@/components/site/site-frame"

export const metadata: Metadata = {
  title: "Terms",
  description: "High-level product terms for MyNews.",
}

export default function Page() {
  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
          Terms
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Product terms for the current application.
        </h1>

        <div className="mt-8 space-y-4">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Use of content</h2>
            <p className="mt-3">
              MyNews presents summaries and metadata from the news feed. Full
              articles remain on the publisher’s site, and outbound links should
              be used for complete context.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Availability</h2>
            <p className="mt-3">
              Feed freshness, sources, and coverage depend on the configured API
              provider and any limits or outages on that service.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Accounts and saves</h2>
            <p className="mt-3">
              Bookmark functionality depends on authentication and database
              configuration. If those services are unavailable, saved stories
              may not work until the environment is restored.
            </p>
          </section>
        </div>
      </section>
    </SiteFrame>
  )
}
