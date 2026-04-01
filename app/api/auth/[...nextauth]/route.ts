import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"

const isProd = process.env.NODE_ENV === "production"

const handler =
  authOptions.providers?.length && (authOptions.secret || !isProd)
    ? NextAuth(authOptions)
    : async (request: Request) => {
        const { pathname } = new URL(request.url)

        // Prevent noisy client-side errors when SessionProvider is mounted but auth
        // isn't configured yet (common during local setup).
        if (pathname.endsWith("/session")) {
          return Response.json(null, { status: 200 })
        }
        if (pathname.endsWith("/providers")) {
          return Response.json({}, { status: 200 })
        }
        if (pathname.endsWith("/_log")) {
          return new Response(null, { status: 204 })
        }

        return Response.json(
          {
            error:
              "Auth is not configured. Set NEXTAUTH_SECRET and at least one provider (e.g. GITHUB_ID/GITHUB_SECRET).",
          },
          { status: 500 },
        )
      }

export { handler as GET, handler as POST }
