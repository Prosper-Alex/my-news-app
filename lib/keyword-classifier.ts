/**
 * Intent classification and topic routing for the news app.
 */

export type NewsCategory =
  | "Nigeria"
  | "World"
  | "Technology"
  | "Sports"
  | "Business"
  | "Entertainment"
  | "General";

export interface ClassificationResult {
  category: NewsCategory;
  topics: string[];
}

const TOPICS_BY_CATEGORY: Record<NewsCategory, string[]> = {
  Nigeria: ["Politics", "Economy", "Security", "Trending Events"],
  World: ["Middle East", "Politics", "Conflicts"],
  Technology: ["Artificial Intelligence", "Startups", "Big Tech", "Innovation"],
  Sports: ["Football", "Transfers", "Tournaments", "Highlights"],
  Business: ["Markets", "Companies", "Finance", "Economy"],
  Entertainment: ["Music", "Movies", "Celebrities", "Pop Culture"],
  General: ["World", "Technology", "Sports", "Business", "Entertainment"],
};

const NIGERIA_TERMS = [
  "nigeria",
  "nigerian",
  "naija",
  "lagos",
  "abuja",
  "port harcourt",
  "kano",
  "in my country",
  "my country",
  "local news",
  "local",
]

const TECHNOLOGY_TERMS = [
  "ai",
  "artificial intelligence",
  "machine learning",
  "automation",
  "startup",
  "startups",
  "tech",
  "technology",
  "software",
  "gadget",
  "gadgets",
  "app",
  "apps",
  "chatgpt",
  "openai",
  "llm",
  "robot",
  "robots",
  "innovation",
]

const SPORTS_TERMS = [
  "sports",
  "football",
  "soccer",
  "basketball",
  "athletics",
  "match",
  "matches",
  "transfer",
  "transfers",
  "tournament",
  "tournaments",
  "league",
  "premier league",
  "champions league",
  "nba",
  "fifa",
  "goal",
  "goals",
  "coach",
]

const BUSINESS_TERMS = [
  "business",
  "finance",
  "financial",
  "market",
  "markets",
  "stock",
  "stocks",
  "company",
  "companies",
  "economy",
  "economic",
  "bank",
  "banking",
  "investment",
  "investments",
  "investor",
  "investors",
  "trade",
  "trading",
]

const ENTERTAINMENT_TERMS = [
  "entertainment",
  "music",
  "movie",
  "movies",
  "film",
  "films",
  "celebrity",
  "celebrities",
  "artist",
  "artists",
  "album",
  "tv",
  "show",
  "shows",
  "actor",
  "actress",
]

const WORLD_TERMS = [
  "world",
  "global",
  "international",
  "iran",
  "greece",
  "usa",
  "united states",
  "europe",
  "uk",
  "united kingdom",
  "china",
  "russia",
  "ukraine",
  "israel",
  "gaza",
  "middle east",
  "war",
  "wars",
  "conflict",
  "conflicts",
  "diplomacy",
  "sanctions",
]

const FILLER_TERMS = [
  "what",
  "whats",
  "what's",
  "is",
  "the",
  "a",
  "an",
  "right now",
  "currently",
  "now",
  "today",
  "latest",
  "show me",
  "tell me",
  "give me",
  "happening",
  "going on",
]

function normalizeInput(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function containsTerm(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`\\b${escaped}\\b`, "i").test(text)
}

function countMatches(text: string, terms: string[]) {
  return terms.reduce((score, term) => {
    if (!containsTerm(text, term)) {
      return score
    }

    return score + (term.includes(" ") ? 2 : 1)
  }, 0)
}

function stripFillerTerms(text: string) {
  let result = text

  for (const term of FILLER_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    result = result.replace(new RegExp(`\\b${escaped}\\b`, "gi"), " ")
  }

  return result.replace(/\s+/g, " ").trim()
}

function isBroadNigeriaIntent(text: string, nigeriaScore: number, otherScores: number[]) {
  if (nigeriaScore === 0) {
    return false
  }

  if (containsTerm(text, "in my country") || containsTerm(text, "my country")) {
    return true
  }

  const broadLocalPatterns = [
    "what is happening in nigeria",
    "what s happening in nigeria",
    "what is happening in my country",
    "news in nigeria",
    "latest in nigeria",
    "happening in nigeria",
  ]

  if (broadLocalPatterns.some((pattern) => text.includes(pattern))) {
    return true
  }

  return otherScores.every((score) => score === 0)
}

export function classifyQuery(input: string): ClassificationResult {
  const normalized = normalizeInput(input)

  if (!normalized) {
    return {
      category: "General",
      topics: TOPICS_BY_CATEGORY.General,
    }
  }

  const text = stripFillerTerms(normalized)

  const nigeriaScore = countMatches(text, NIGERIA_TERMS)
  const technologyScore = countMatches(text, TECHNOLOGY_TERMS)
  const sportsScore = countMatches(text, SPORTS_TERMS)
  const businessScore = countMatches(text, BUSINESS_TERMS)
  const entertainmentScore = countMatches(text, ENTERTAINMENT_TERMS)
  const worldScore = countMatches(text, WORLD_TERMS)

  if (
    isBroadNigeriaIntent(text, nigeriaScore, [
      technologyScore,
      sportsScore,
      businessScore,
      entertainmentScore,
      worldScore,
    ])
  ) {
    return {
      category: "Nigeria",
      topics: TOPICS_BY_CATEGORY.Nigeria,
    }
  }

  const rankedCategories: Array<{ category: NewsCategory; score: number }> = [
    { category: "Technology", score: technologyScore },
    { category: "Sports", score: sportsScore },
    { category: "Business", score: businessScore },
    { category: "Entertainment", score: entertainmentScore },
    { category: "Nigeria", score: nigeriaScore },
    { category: "World", score: worldScore },
  ]

  const strongest = rankedCategories.reduce<{
    category: NewsCategory
    score: number
  } | null>((best, entry) => {
    if (entry.score === 0) {
      return best
    }

    if (!best || entry.score > best.score) {
      return entry
    }

    return best
  }, null)

  if (!strongest) {
    return {
      category: "General",
      topics: TOPICS_BY_CATEGORY.General,
    }
  }

  return {
    category: strongest.category,
    topics: TOPICS_BY_CATEGORY[strongest.category],
  }
}
