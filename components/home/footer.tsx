import Link from "next/link"
import { footerNavLinks } from "@/lib/site-navigation"

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10 lg:px-8">
        <div>
          <div className="font-semibold tracking-[0.16em] text-white uppercase">
            MyNews
          </div>
          <div className="mt-1">
            © {new Date().getFullYear()} MyNews. Modern headline briefings for fast reading.
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          {footerNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
