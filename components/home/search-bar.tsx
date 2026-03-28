"use client"

type SearchBarProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
}

export function SearchBar({
  value,
  placeholder = "Search news…",
  onChange,
  onSubmit,
  onClear,
}: SearchBarProps) {
  const hasValue = Boolean(value.trim())

  return (
    <form
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-400">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.3-4.3m1.8-6.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
          />
        </svg>
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-24 text-sm text-white shadow-sm outline-none ring-offset-2 backdrop-blur-md placeholder:text-zinc-400 focus:ring-2 focus:ring-white/30"
      />

      {hasValue ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-2 inline-flex items-center rounded-xl px-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
          aria-label="Clear search"
        >
          Clear
        </button>
      ) : null}
    </form>
  )
}

