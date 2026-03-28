Production-ready news SaaS starter built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

1) Create env file:

```bash
cp .env.example .env.local
```

2) Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

- News is fetched server-side in `app/api/news/route.ts` using `NEWS_API_KEY` (kept out of the browser).
- Auth is scaffolded with NextAuth in `app/api/auth/[...nextauth]/route.ts` (GitHub provider).
- Bookmarks use Prisma + PostgreSQL via `DATABASE_URL` and the `/api/bookmarks` route.

## Database (Bookmarks)

1) Set `DATABASE_URL` in `.env.local` (PostgreSQL).

2) Run migrations + generate Prisma client:

```bash
pnpm prisma:migrate
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
