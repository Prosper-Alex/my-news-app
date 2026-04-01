"use client"

import type { ReactNode } from "react"
import { Navbar } from "@/components/home/navbar"
import { Footer } from "@/components/home/footer"

type SiteFrameProps = {
  children: ReactNode
  query?: string
  onQueryChange?: (value: string) => void
  onSearch?: () => void
  onClear?: () => void
  showSearch?: boolean
}

export function SiteFrame({
  children,
  query,
  onQueryChange,
  onSearch,
  onClear,
  showSearch = false,
}: SiteFrameProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(1000px_circle_at_80%_0%,rgba(244,114,182,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_100%,rgba(16,185,129,0.16),transparent_45%)] bg-black text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>

      <Navbar
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        onClear={onClear}
        showSearch={showSearch}
      />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
