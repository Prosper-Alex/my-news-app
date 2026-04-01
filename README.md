Production-ready news SaaS starter built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

### 1. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your NEWS_API_KEY:

```env
# Get a free key from https://newsapi.org/
NEWS_API_KEY=your_api_key_here
```

### 2. Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. (Optional) Setup Database for Bookmarks

If you want to use the bookmarks feature with PostgreSQL:

```bash
# Set DATABASE_URL in .env.local
pnpm prisma:migrate
```

## How It Works

- **News API**: Fetched server-side in `app/api/news/route.ts` using `NEWS_API_KEY` (never exposed to the browser).
- **Build Safety**: The app uses dynamic rendering (`force-dynamic`) to prevent build crashes when the API key is missing. Graceful fallback UI is shown.
- **Error Handling**: If `NEWS_API_KEY` is not set, the app displays a helpful setup guide instead of crashing.
- **Auth**: NextAuth with GitHub provider in `app/api/auth/[...nextauth]/route.ts`.
- **Bookmarks**: Prisma + PostgreSQL integration via `/api/bookmarks`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
