"use client"

type SkeletonLoaderProps = {
  count?: number
}

export function SkeletonLoader({ count = 12 }: SkeletonLoaderProps) {
  return (
    <div className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
        >
          <div className="mb-4 h-48 w-full rounded-2xl bg-white/10" />
          <div className="h-4 w-4/5 rounded bg-white/10" />
          <div className="mt-3 h-4 w-3/5 rounded bg-white/10" />
          <div className="mt-6 h-3 w-2/5 rounded bg-white/10" />
          <div className="mt-8 h-4 w-1/3 rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}
