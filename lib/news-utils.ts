import type { NewsItem } from "@/types/news";

export type StoryPreview = {
  title: string;
  url: string;
  description?: string | null;
  imageUrl?: string | null;
  sourceName?: string | null;
  sourceId?: string | null;
  sourceDomain?: string | null;
  author?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  readTimeMinutes?: number | null;
};

type StorySearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

const topicStopWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "from",
  "at",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "by",
  "new",
  "today",
  "latest",
  "after",
  "before",
  "into",
  "about",
  "amid",
]);

function cleanText(value?: string | null) {
  if (!value) return null;

  const cleaned = value.replace(/\s*\[\+\d+\s+chars\]\s*$/i, "").trim();
  return cleaned || null;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function getSourceDomain(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}

export function estimateReadTimeMinutes(
  ...parts: Array<string | null | undefined>
) {
  const text = parts
    .map((part) => cleanText(part))
    .filter(Boolean)
    .join(" ");

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function formatStoryDate(value?: string | null) {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  // Use explicit "en-US" locale for consistency
  // Omit timeZone to use local timezone on both server and client
  // This prevents hydration mismatch from timezone conversion
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
}

export function toStorySlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "story-briefing";
}

export function createStoryHref(story: StoryPreview) {
  const params = new URLSearchParams();

  params.set("title", story.title);
  params.set("url", story.url);

  const fields = {
    description: cleanText(story.description),
    imageUrl: story.imageUrl?.trim() || null,
    sourceName: story.sourceName?.trim() || null,
    sourceId: story.sourceId?.trim() || null,
    sourceDomain: story.sourceDomain?.trim() || getSourceDomain(story.url),
    author: cleanText(story.author),
    content: cleanText(story.content),
    publishedAt: story.publishedAt?.trim() || null,
    readTimeMinutes:
      typeof story.readTimeMinutes === "number" && story.readTimeMinutes > 0
        ? String(story.readTimeMinutes)
        : null,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(key, value);
  }

  return `/stories/${toStorySlug(story.title)}?${params.toString()}`;
}

export async function readStoryFromSearchParams(
  searchParams: StorySearchParams,
): Promise<StoryPreview | null> {
  const resolved = await searchParams;
  const title = firstValue(resolved.title)?.trim();
  const url = firstValue(resolved.url)?.trim();

  if (!title || !url) return null;

  const description = cleanText(firstValue(resolved.description));
  const content = cleanText(firstValue(resolved.content));
  const readTimeParam = Number.parseInt(
    firstValue(resolved.readTimeMinutes) ?? "",
    10,
  );

  return {
    title,
    url,
    description,
    imageUrl: firstValue(resolved.imageUrl)?.trim() || null,
    sourceName: firstValue(resolved.sourceName)?.trim() || null,
    sourceId: firstValue(resolved.sourceId)?.trim() || null,
    sourceDomain:
      firstValue(resolved.sourceDomain)?.trim() || getSourceDomain(url),
    author: cleanText(firstValue(resolved.author)),
    content,
    publishedAt: firstValue(resolved.publishedAt)?.trim() || null,
    readTimeMinutes:
      Number.isFinite(readTimeParam) && readTimeParam > 0
        ? readTimeParam
        : estimateReadTimeMinutes(description, content),
  };
}

export function extractTopics(
  items: Array<Pick<NewsItem, "title" | "description">>,
) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const tokens = [item.title, item.description]
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => token.length >= 4 && !topicStopWords.has(token));

    for (const token of tokens) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 12)
    .map(([topic]) => topic);
}

export function getNewsPulse(items: NewsItem[]) {
  const sourceCount = new Set(items.map((item) => item.sourceName)).size;
  const withImages = items.filter((item) => item.imageUrl).length;
  const withAuthors = items.filter((item) => item.author).length;
  const averageReadTime = items.length
    ? Math.max(
        1,
        Math.round(
          items.reduce((total, item) => total + item.readTimeMinutes, 0) /
            items.length,
        ),
      )
    : 0;

  return {
    totalStories: items.length,
    sourceCount,
    withImages,
    withAuthors,
    averageReadTime,
  };
}

export function getSourceBreakdown(items: NewsItem[], limit = 4) {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.sourceName, (counts.get(item.sourceName) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      share: items.length ? Math.round((count / items.length) * 100) : 0,
    }));
}

export function getStoryTopicLinks(story: StoryPreview) {
  return extractTopics([
    {
      title: story.title,
      description: story.description ?? null,
    },
  ]).slice(0, 5);
}
