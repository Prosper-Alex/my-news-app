import type { Metadata } from "next"
import { SiteFrame } from "@/components/site/site-frame"

export const metadata: Metadata = {
  title: "Privacy",
  description: "High-level privacy information for MyNews.",
}

export default function Page() {
  return (
    <SiteFrame>
      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
          Privacy
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Privacy information for the current product setup.
        </h1>

        <div className="mt-8 space-y-4">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Account data</h2>
            <p className="mt-3">
              If sign-in is enabled, the app stores only the account information
              needed to identify a user session and associate bookmarks with
              that user.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Bookmarks</h2>
            <p className="mt-3">
              Saved stories retain article URL, title, source information,
              optional image URL, and timestamps so the reading queue can be
              restored across sessions.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">Feed content</h2>
            <p className="mt-3">
              Article data is pulled from the configured news API and displayed
              as briefings. Users can always open the original publisher link
              for the complete story and source context.
            </p>
          </section>
        </div>
      </section>
    </SiteFrame>
  )
}
