# Complete NextAuth.js Authentication System Guide

## 📋 Overview

This is a production-ready authentication system built with **NextAuth.js 4**, **Next.js App Router**, and **GitHub OAuth**. The system includes login, registration, onboarding, protected routes, and API endpoints.

## 🚀 Quick Start

### 1. Environment Variables

Your `.env` already has these configured:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-generated-secret>
GITHUB_ID=<your-github-oauth-id>
GITHUB_SECRET=<your-github-oauth-secret>
```

**Get GitHub OAuth Credentials:**

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - Application name: `My News App`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** to `.env`

### 2. Start Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) to test!

---

## 🏗️ Architecture

### File Structure

```
lib/
├── auth.ts                     # Server-side auth utilities
└── auth/
    └── auth-options.ts         # NextAuth configuration

components/
└── auth/
    ├── auth-button.tsx         # Simple auth button (legacy)
    ├── enhanced-auth-button.tsx # Modern auth button with profile
    ├── github-signin-button.tsx # GitHub sign-in button
    ├── user-profile.tsx         # User profile display component
    └── ui/
        ├── toast.tsx            # Toast notifications
        └── loading-spinner.tsx   # Loading spinner component

app/
├── (auth)/
│   ├── layout.tsx              # Auth routes layout
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── register/
│       └── page.tsx            # Registration page
├── onboarding/
│   └── page.tsx                # Post-signup preferences
├── dashboard/
│   └── page.tsx                # Protected dashboard
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts        # NextAuth handler
│   └── user/
│       └── route.ts            # Protected user API
└── middleware.ts               # Route protection middleware
```

---

## 🔐 Authentication Flow

### Login Flow (GitHub OAuth)

```
1. User clicks "Sign in with GitHub"
   ↓
2. GitHubSignInButton triggers signIn("github")
   ↓
3. NextAuth redirects to GitHub authorization
   ↓
4. User approves access
   ↓
5. GitHub redirects to /api/auth/callback/github
   ↓
6. NextAuth exchanges code for session
   ↓
7. User is redirected to Dashboard (/dashboard)
```

### Session Management

```
Browser              NextAuth             Database/Cookie
   │                   │                        │
   ├─── useSession() ──→│                        │
   │                   ├─── Check JWT token ───→│
   │                   │← Valid? Return session │
   │←─ session ────────┤                        │
```

---

## 📁 Key Components & Files

### 1. **lib/auth.ts** - Server-side utilities

```typescript
import { getCurrentSession } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";
import { isAuthenticated } from "@/lib/auth";

// In a Server Component or API Route
const session = await getCurrentSession();
const user = await getCurrentUser();
const isAuth = await isAuthenticated();
```

### 2. **lib/auth/auth-options.ts** - NextAuth Configuration

```typescript
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },    // JWT-based sessions
  providers: [GitHubProvider(...)], // GitHub OAuth
  callbacks: {
    session: ({ session, token }) => {
      // Add user ID to session
      session.user.id = token.sub
      return session
    }
  }
}
```

### 3. **components/auth/github-signin-button.tsx** - Modern Sign-in Button

```typescript
import { GitHubSignInButton } from "@/components/auth/github-signin-button"

export function LoginPage() {
  return <GitHubSignInButton size="lg" fullWidth />
}
```

### 4. **components/auth/enhanced-auth-button.tsx** - Conditional Auth UI

```typescript
import { EnhancedAuthButton } from "@/components/auth/enhanced-auth-button"

// Shows user profile + sign out when authenticated
// Shows "Sign in with GitHub" when not authenticated
export function Header() {
  return <EnhancedAuthButton />
}
```

### 5. **app/dashboard/page.tsx** - Protected Page

```typescript
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getCurrentSession()

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login")
  }

  return <div>Welcome, {session.user.name}!</div>
}
```

### 6. **app/api/user/route.ts** - Protected API Route

```typescript
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  // Return 401 if not authenticated
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user });
}
```

---

## 🧭 Common Use Cases

### 1. Use Session in Client Component

```typescript
"use client"

import { useSession } from "next-auth/react"

export function UserGreeting() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") return <div>Sign in first</div>

  return <div>Hello, {session.user.name}!</div>
}
```

### 2. Get Session in Server Component

```typescript
import { getCurrentSession } from "@/lib/auth"

export default async function Page() {
  const session = await getCurrentSession()
  const user = session?.user

  return <div>{user?.name}</div>
}
```

### 3. Protect API Route

```typescript
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated, proceed...
  return Response.json({ success: true });
}
```

### 4. Sign In/Out

```typescript
"use client"

import { signIn, signOut } from "next-auth/react"

export function AuthActions() {
  return (
    <>
      <button onClick={() => signIn("github")}>
        Sign In
      </button>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </>
  )
}
```

### 5. Add Loading State

```typescript
"use client"

import { signIn } from "next-auth/react"
import { useTransition } from "react"

export function SignInButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(async () => {
        await signIn("github")
      })}
      disabled={isPending}
    >
      {isPending ? "Signing in..." : "Sign In"}
    </button>
  )
}
```

---

## 🔄 Authentication Flow Diagrams

### First-Time User Flow

```
┌─────────────────┐
│  Visit /login   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Click "Sign in with GitHub" │
└────────┬────────────────────┘
         │
         ▼
┌───────────────────────────────┐
│ Redirected to GitHub OAuth    │
│ (user grants permission)      │
└────────┬──────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ /api/auth/callback/github       │
│ (NextAuth exchanges OAuth code) │
└────────┬──────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirected to /dashboard │
└──────────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Session is created  │
│ JWT token in cookie │
└─────────────────────┘
```

### Protected Route Access

```
User visits /dashboard
         │
         ▼
middleware.ts checks session
         │
    ┌────┴────┐
    │          │
 Found    Not Found
    │          │
    ▼          ▼
 Render    Redirect
Dashboard  to /login
```

---

## 🛡️ Security Features

1. **JWT-based Sessions**: More secure than database sessions
2. **CSRF Protection**: NextAuth handles CSRF tokens
3. **Secure Cookies**: `HttpOnly`, `Secure`, `SameSite` flags
4. **Environment Variables**: Secrets kept server-side
5. **Middleware**: Route-level protection
6. **Type Safety**: Full TypeScript support
7. **API Protection**: Server-side validation

---

## 🎨 UI Components

### LoadingSpinner

```typescript
import { LoadingSpinner } from "@/components/ui/loading-spinner"

<LoadingSpinner size="md" />
// Sizes: sm | md | lg
```

### UserProfile

```typescript
import { UserProfile } from "@/components/auth/user-profile"

<UserProfile session={session} />
```

### Toast Notifications

```typescript
"use client"

import { useToast, ToastContainer } from "@/components/ui/toast"

export function MyComponent() {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      <button onClick={() => addToast("Success!", "success")}>
        Show Toast
      </button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
```

---

## 🚀 Production Deployment

### 1. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 2. Set Environment Variables

```env
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-domain.com
GITHUB_ID=<your-production-github-oauth-id>
GITHUB_SECRET=<your-production-github-oauth-secret>
```

### 3. Update GitHub OAuth Callback URL

- Go to https://github.com/settings/developers
- Update Authorization callback URL to: `https://your-domain.com/api/auth/callback/github`

### 4. Deploy to Vercel

```bash
git push
# Vercel auto-deploys
# Add env vars in Vercel dashboard
```

---

## 🔄 Next Steps: Add Database Sessions

To persist sessions in a database (instead of just cookies):

### 1. Install Prisma Adapter

```bash
pnpm add @auth/prisma-adapter
```

### 2. Update auth-options.ts

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // ... rest of config
};
```

### 3. Update Prisma Schema

```prisma
model Account {
  id String @id @default(cuid())
  userId String
  type String
  provider String
  providerAccountId String
  refresh_token String?
  access_token String?
  expires_at Int?
  token_type String?
  scope String?
  id_token String?
  session_state String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id String @id @default(cuid())
  sessionToken String @unique
  userId String
  expires DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id String @id @default(cuid())
  name String?
  email String? @unique
  emailVerified DateTime?
  image String?
  accounts Account[]
  sessions Session[]
}

model VerificationToken {
  identifier String
  token String @unique
  expires DateTime

  @@unique([identifier, token])
}
```

### 4. Run Migrations

```bash
pnpm prisma migrate dev
```

---

## 🐛 Troubleshooting

### "OAuth callback mismatch"

- Check GitHub OAuth URL matches exactly

### "NEXTAUTH_SECRET not found"

- Generate and add to `.env`: `openssl rand -base64 32`

### Session not persisting

- Check cookies in DevTools → Application → Cookies
- Verify `NEXTAUTH_URL` matches current domain

### "Not authenticated" on protected routes

- Ensure `SessionProvider` wraps your app in `app/layout.tsx`
- Check browser cookies for `next-auth.session-token`

---

## 📚 Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## 📝 Summary

✅ Complete authentication system with GitHub OAuth  
✅ Protected dashboard and API routes  
✅ Beautiful UI components with Tailwind CSS  
✅ Toast notifications for user feedback  
✅ Loading states and error handling  
✅ TypeScript for type safety  
✅ Production-ready and scalable

You now have a secure, modern authentication system ready for production! 🎉
