"use client"

import type { ReactNode } from "react"

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-200 backdrop-blur-md">
      <div className="text-base font-semibold text-white">{title}</div>
      {description ? (
        <div className="mt-1 text-zinc-300">{description}</div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
