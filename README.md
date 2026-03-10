This is the **kaixun.online** personal site: Next.js (App Router) + Prisma + PostgreSQL, with auth (email + GitHub), comments, and an admin dashboard.

## Features

- **Auth**: Email/password sign up and sign in; GitHub OAuth (optional).
- **Account linking**: If you already have an account with the same email and later sign in with GitHub, the GitHub account is linked to that user automatically.
- **Posts**: Home lists published posts; each post has a detail page with comments.
- **Admin** (`/admin`): Manage posts and comments (admin role required).

## GitHub OAuth

1. In [GitHub Developer Settings](https://github.com/settings/developers), create an OAuth App.
2. Set **Authorization callback URL** to:
   - Local: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://kaixun.online/api/auth/callback/github`
3. Put `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
