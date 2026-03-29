import Link from "next/link"

const quickLinks = [
  {
    href: "/discover",
    label: "Discover desk",
    title: "Browse focused coverage",
    description: "Jump into category-driven briefings without losing the homepage feed.",
  },
  {
    href: "/saved",
    label: "Saved briefings",
    title: "Keep your reading queue together",
    description: "Your bookmarks now live on a dedicated page with room to grow.",
  },
  {
    href: "/about",
    label: "About the product",
    title: "See how the newsroom is structured",
    description: "Product details, editorial intent, and platform direction in one place.",
  },
]

export function QuickLinks() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {quickLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
        >
          <div className="text-xs font-semibold tracking-[0.16em] text-fuchsia-200 uppercase">
            {link.label}
          </div>
          <div className="mt-3 text-lg font-semibold text-white">
            {link.title}
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {link.description}
          </p>
          <div className="mt-4 text-sm font-semibold text-white">
            Open page
            <span aria-hidden="true" className="ml-2 transition group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      ))}
    </section>
  )
}
