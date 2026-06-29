import { auth } from "@clerk/nextjs/server"
import { getPrisma } from "@/lib/db"
import type { Bookmark, CreateBookmarkInput } from "@/types/bookmarks"

const DATABASE_PLACEHOLDER_PARTS = new Set(["USER", "PASSWORD", "HOST", "DATABASE"])

function getDatabaseUrlState() {
  const value = process.env.DATABASE_URL?.trim()
  if (!value) return "missing"

  try {
    const url = new URL(value)
    const parts = [
      decodeURIComponent(url.username),
      decodeURIComponent(url.password),
      url.hostname,
      url.pathname.replace(/^\//, ""),
    ]

    return parts.some((part) => DATABASE_PLACEHOLDER_PARTS.has(part))
      ? "placeholder"
      : "ready"
  } catch {
    return "invalid"
  }
}

function bookmarksUnavailableResponse() {
  return Response.json(
    { error: "Bookmarks database is not configured." },
    { status: 503 },
  )
}

function isDatabaseUnavailableError(error: unknown) {
  if (!(error instanceof Error)) return false

  return (
    error.name === "PrismaClientInitializationError" ||
    error.message.includes("Can't reach database server") ||
    error.message.includes("Error querying the database")
  )
}

function toBookmark(row: {
  id: string
  articleUrl: string
  title: string
  imageUrl: string | null
  sourceName: string | null
  publishedAt: Date | null
  createdAt: Date
}): Bookmark {
  return {
    id: row.id,
    articleUrl: row.articleUrl,
    title: row.title,
    imageUrl: row.imageUrl,
    sourceName: row.sourceName,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  }
}

async function requireUserId(): Promise<
  { ok: true; userId: string } | { ok: false; res: Response }
> {
  const { userId } = await auth()
  if (!userId) {
    return {
      ok: false,
      res: Response.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  return { ok: true, userId }
}

export async function GET() {
  const auth = await requireUserId()
  if (!auth.ok) return auth.res

  if (getDatabaseUrlState() !== "ready") {
    return Response.json({ items: [], bookmarksAvailable: false })
  }

  try {
    const prisma = getPrisma()
    const rows = await prisma.bookmark.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return Response.json({ items: rows.map(toBookmark), bookmarksAvailable: true })
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return Response.json({ items: [], bookmarksAvailable: false })
    }

    throw error
  }
}

export async function POST(request: Request) {
  const auth = await requireUserId()
  if (!auth.ok) return auth.res

  if (getDatabaseUrlState() !== "ready") {
    return bookmarksUnavailableResponse()
  }

  let body: CreateBookmarkInput
  try {
    body = (await request.json()) as CreateBookmarkInput
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const articleUrl = body.articleUrl?.trim()
  const title = body.title?.trim()
  if (!articleUrl || !title) {
    return Response.json(
      { error: "Missing required fields: articleUrl, title" },
      { status: 400 },
    )
  }

  try {
    const prisma = getPrisma()
    const row = await prisma.bookmark.upsert({
      where: {
        userId_articleUrl: {
          userId: auth.userId,
          articleUrl,
        },
      },
      create: {
        userId: auth.userId,
        articleUrl,
        title,
        imageUrl: body.imageUrl ?? null,
        sourceName: body.sourceName ?? null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
      update: {
        title,
        imageUrl: body.imageUrl ?? null,
        sourceName: body.sourceName ?? null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
    })

    return Response.json({ item: toBookmark(row) })
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return bookmarksUnavailableResponse()
    }

    throw error
  }
}

export async function DELETE(request: Request) {
  const auth = await requireUserId()
  if (!auth.ok) return auth.res

  if (getDatabaseUrlState() !== "ready") {
    return bookmarksUnavailableResponse()
  }

  let body: { articleUrl?: string }
  try {
    body = (await request.json()) as { articleUrl?: string }
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const articleUrl = body.articleUrl?.trim()
  if (!articleUrl) {
    return Response.json(
      { error: "Missing required field: articleUrl" },
      { status: 400 },
    )
  }

  try {
    const prisma = getPrisma()
    await prisma.bookmark.deleteMany({
      where: { userId: auth.userId, articleUrl },
    })
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return bookmarksUnavailableResponse()
    }

    throw error
  }

  return Response.json({ ok: true })
}
