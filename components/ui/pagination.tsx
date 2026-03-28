"use client"

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPageItems(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const current = clamp(page, 1, totalPages)
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)

  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p)
  }

  // Keep a bit of context around the edges.
  if (current <= 3) {
    pages.add(2)
    pages.add(3)
    pages.add(4)
  }
  if (current >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
    pages.add(totalPages - 3)
  }

  const ordered = [...pages].sort((a, b) => a - b)
  const items: Array<number | "ellipsis"> = []
  for (let i = 0; i < ordered.length; i++) {
    const value = ordered[i]
    const prev = ordered[i - 1]
    if (prev && value - prev > 1) items.push("ellipsis")
    items.push(value)
  }

  return items
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const current = clamp(page, 1, totalPages)
  const canPrev = current > 1
  const canNext = current < totalPages
  const items = getPageItems(current, totalPages)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onPageChange(current - 1)}
        disabled={!canPrev}
        className={[
          "inline-flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition",
          canPrev
            ? "border-white/10 bg-black/30 text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
            : "border-white/10 bg-black/20 text-zinc-500 opacity-60",
        ].join(" ")}
      >
        Prev
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-1 text-sm text-zinc-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === current ? "page" : undefined}
              className={[
                "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition",
                item === current
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-black/30 text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="sm:hidden">
        <span className="text-sm text-zinc-300">
          {current}/{totalPages}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(current + 1)}
        disabled={!canNext}
        className={[
          "inline-flex h-9 items-center rounded-xl border px-3 text-sm font-semibold transition",
          canNext
            ? "border-white/10 bg-black/30 text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
            : "border-white/10 bg-black/20 text-zinc-500 opacity-60",
        ].join(" ")}
      >
        Next
      </button>
    </nav>
  )
}

