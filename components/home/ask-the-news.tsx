"use client";

import { useState } from "react";
import type { NewsCategory } from "@/types/news";

const suggestedQuestions = [
  "What is happening in Nigeria today?",
  "Show me the latest AI and startup headlines",
  "What are the biggest sports stories right now?",
];

const categoryLabels: Record<NewsCategory, string> = {
  all: "All",
  technology: "Tech",
  business: "Business",
  sports: "Sports",
  local: "Nigeria",
};

export type AskTheNewsIntent = {
  category: NewsCategory;
  query?: string;
};

function questionToIntent(question: string): AskTheNewsIntent | null {
  const normalized = question.toLowerCase();

  if (/\b(nigeria|nigerian|local)\b/.test(normalized)) {
    return { category: "local" };
  }

  if (/\b(sport|sports|football|match|games?|scores?)\b/.test(normalized)) {
    return { category: "sports" };
  }

  if (
    /\b(ai|a\.i\.|artificial intelligence|startup|startups|tech|technology)\b/.test(
      normalized,
    )
  ) {
    return { category: "technology", query: "AI startup" };
  }

  if (
    /\b(business|market|markets|economy|finance|bank|banks)\b/.test(normalized)
  ) {
    return { category: "business" };
  }

  const query = questionToQuery(question);
  return query ? { category: "all", query } : null;
}

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
  ]);

  const tokens = question
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t.length > 2 && !stop.has(t));

  return tokens.slice(0, 6).join(" ");
}

type AskTheNewsProps = {
  onAsk: (intent: AskTheNewsIntent) => void;
};

export function AskTheNews({ onAsk }: AskTheNewsProps) {
  const [value, setValue] = useState("");
  const [interpretedIntent, setInterpretedIntent] =
    useState<AskTheNewsIntent | null>(null);

  function submitIntent(intent: AskTheNewsIntent) {
    setInterpretedIntent(intent);
    onAsk(intent);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="text-sm font-semibold text-white">Ask the news</div>
      <p className="mt-1 text-sm text-zinc-300">
        Ask a question. We’ll turn it into a search and fetch matching
        headlines.
      </p>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const intent = questionToIntent(value.trim());
          if (intent) submitIntent(intent);
        }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="“What’s happening in Nigeria today?”"
          aria-label="Ask the news"
          className="h-11 w-full flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white shadow-sm outline-none backdrop-blur-md placeholder:text-zinc-400 focus:ring-2 focus:ring-white/30"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200">
          Ask
        </button>
      </form>

      {interpretedIntent ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span>Interpreted as:</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 font-semibold text-white">
            {categoryLabels[interpretedIntent.category]}
          </span>
          {interpretedIntent.query ? (
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 font-semibold text-cyan-100">
              {interpretedIntent.query}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => {
              setValue(question);
              const intent = questionToIntent(question);
              if (intent) submitIntent(intent);
            }}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}
