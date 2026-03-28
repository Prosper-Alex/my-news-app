import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const githubId = process.env.GITHUB_ID
const githubSecret = process.env.GITHUB_SECRET

const hasGithub = Boolean(githubId && githubSecret)

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  session: { strategy: "jwt" },
  providers: [
    ...(hasGithub
      ? [
          GitHubProvider({
            clientId: githubId as string,
            clientSecret: githubSecret as string,
          }),
        ]
      : process.env.NODE_ENV !== "production"
        ? [
            CredentialsProvider({
              name: "Dev (No OAuth configured)",
              credentials: {},
              async authorize() {
                return null
              },
            }),
          ]
        : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        ;(session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },
}

export function assertAuthEnv() {
  const missing: string[] = []
  if (!process.env.NEXTAUTH_SECRET) missing.push("NEXTAUTH_SECRET")
  if (!process.env.NEXTAUTH_URL) missing.push("NEXTAUTH_URL")
  if (process.env.NODE_ENV === "production") {
    if (!githubId) missing.push("GITHUB_ID")
    if (!githubSecret) missing.push("GITHUB_SECRET")
  }
  if (missing.length) {
    throw new Error(`Missing auth env vars: ${missing.join(", ")}`)
  }
}
