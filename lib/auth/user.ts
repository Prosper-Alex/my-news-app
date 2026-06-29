export type AppUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

type ClerkUserLike = {
  id: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  imageUrl?: string | null
  primaryEmailAddress?: {
    emailAddress?: string | null
  } | null
  emailAddresses?: Array<{
    emailAddress?: string | null
  }>
}

export function toAppUser(user: ClerkUserLike | null | undefined): AppUser | null {
  if (!user) {
    return null
  }

  const composedName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()
  const fallbackName = composedName || user.username || null

  return {
    id: user.id,
    name: user.fullName ?? fallbackName,
    email:
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      null,
    image: user.imageUrl ?? null,
  }
}

export function getUserInitial(name: string | null) {
  return (name ?? "M").trim().charAt(0).toUpperCase() || "M"
}
