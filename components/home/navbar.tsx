"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import { SearchBar } from "@/components/home/search-bar";
import { primaryNavLinks } from "@/lib/site-navigation";

type NavbarProps = {
  query?: string;
  onQueryChange?: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  showSearch?: boolean;
};

export function Navbar({
  query,
  onQueryChange,
  onSearch,
  onClear,
  showSearch = false,
}: NavbarProps) {
  const pathname = usePathname();
  const searchEnabled =
    showSearch && query !== undefined && onQueryChange && onSearch && onClear;

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold tracking-[0.18em] text-white uppercase">
            MyNews
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-2 md:flex">
            {primaryNavLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white/12 text-white"
                      : "text-zinc-300 hover:bg-white/8 hover:text-white",
                  ].join(" ")}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {searchEnabled ? (
          <div className="order-3 w-full lg:order-0 lg:flex-1">
            <div className="mx-auto w-full max-w-3xl">
              <SearchBar
                value={query}
                onChange={onQueryChange}
                onSubmit={onSearch}
                onClear={onClear}
                placeholder="Search headlines, topics, sources…"
              />
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        <div className="ml-auto shrink-0">
          <AuthButton />
        </div>

        <nav
          aria-label="Primary mobile"
          className="order-4 flex w-full gap-2 overflow-x-auto pb-1 md:hidden">
          {primaryNavLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition",
                  active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-black/20 text-zinc-300 hover:border-white/20 hover:text-white",
                ].join(" ")}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
