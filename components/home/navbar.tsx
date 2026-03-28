"use client"

import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"
import { SearchBar } from "@/components/home/search-bar"

type NavbarProps = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
}

export function Navbar({
  query,
  onQueryChange,
  onSearch,
  onClear,
}: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-white"
        >
          MyNews
        </Link>

        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={onQueryChange}
            onSubmit={onSearch}
            onClear={onClear}
            placeholder="Search headlines, topics, sources…"
          />
        </div>

        <div className="shrink-0">
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
