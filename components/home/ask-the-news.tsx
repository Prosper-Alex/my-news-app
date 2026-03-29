"use client"

import { useState } from "react"

const suggestedQuestions = [
  "What is happening in Nigeria today?",
  "Show me the latest AI and startup headlines",
  "What are the biggest sports stories right now?",
]

function questionToQuery(question: string): string {
  const stop = new Set([
    "what",
    "whats",
    "what's",
    "happening",
    "in",
    "on",
    "at",
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "for",
    "of",
    "about",
    "today",
    "latest",
    "news",
    "please",
    "show",
    "me",
  ])

  const tokens = question
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t.length > 2 && !stop.has(t))

  return tokens.slice(0, 6).join(" ")
}

type AskTheNewsProps = {
  onAsk: (query: string) => void
}

export function AskTheNews({ onAsk }: AskTheNewsProps) {
  const [value, setValue] = useState("")

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="text-sm font-semibold text-white">Ask the news</div>
      <p className="mt-1 text-sm text-zinc-300">
        Ask a question. We’ll turn it into a search and fetch matching headlines.
      </p>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          const q = questionToQuery(value.trim())
          if (q) onAsk(q)
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="“What’s happening in Nigeria today?”"
          aria-label="Ask the news"
          className="h-11 w-full flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white shadow-sm outline-none backdrop-blur-md placeholder:text-zinc-400 focus:ring-2 focus:ring-white/30"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200"
        >
          Ask
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => {
              setValue(question)
              const nextQuery = questionToQuery(question)
              if (nextQuery) onAsk(nextQuery)
            }}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  )
}
