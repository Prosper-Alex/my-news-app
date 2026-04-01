import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import type { Bookmark, CreateBookmarkInput } from "@/types/bookmarks"

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
  if (!process.env.DATABASE_URL) {
    return {
      ok: false,
      res: Response.json(
        { error: "Server misconfigured: missing DATABASE_URL." },
        { status: 500 },
      ),
    }
  }

  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
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

  const rows = await prisma.bookmark.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return Response.json({ items: rows.map(toBookmark) })
}

export async function POST(request: Request) {
  const auth = await requireUserId()
  if (!auth.ok) return auth.res

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
}

export async function DELETE(request: Request) {
  const auth = await requireUserId()
  if (!auth.ok) return auth.res

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

  await prisma.bookmark.deleteMany({
    where: { userId: auth.userId, articleUrl },
  })

  return Response.json({ ok: true })
}
