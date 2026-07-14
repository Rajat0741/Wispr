# nbd-stack

> **N**ext.js · **B**etter Auth · **D**rizzle ORM

A production-ready starter template for Next.js apps that need authentication without the boilerplate. Clone, configure, and ship.

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Auth | [Better Auth](https://www.better-auth.com) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | [Neon](https://neon.tech) (serverless Postgres) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Linting / Formatting | [Biome](https://biomejs.dev) |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm i -g pnpm`)
- A **Neon** database ([free tier](https://neon.tech))
- A **Google OAuth 2.0** client ([console](https://console.cloud.google.com/apis/credentials))
  - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/Rajat0741/nbd-stack my-app
cd my-app
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL=          # Neon connection string
BETTER_AUTH_SECRET=    # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Push the database schema

```bash
pnpm db:push
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with Google, get redirected to your profile. Done.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Biome lint check |
| `pnpm format` | Biome auto-format |
| `pnpm db:push` | Sync schema to DB (no migration files) |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm auth:generate` | Regenerate `auth-schema.ts` from your `auth.ts` config |

---

## Folder Structure

```
src/
├── app/
│   ├── api/auth/[...all]/route.ts   # Better Auth request handler
│   ├── login/page.tsx               # Public — redirects to /profile if session exists
│   ├── profile/page.tsx             # Protected — redirects to /login if no session
│   └── page.tsx                     # Landing page
├── features/
│   ├── auth/
│   │   ├── actions/                 # Server actions for auth (add yours here)
│   │   ├── hooks/                   # Client-side hooks for auth
│   │   └── components/
│   │       └── login-card.tsx
│   └── profile/
│       ├── actions/                 # Server actions for profile (add yours here)
│       ├── hooks/                   # Client-side hooks for profile
│       └── components/
│           └── profile-card.tsx
├── lib/
│   ├── auth.ts                      # Server-side Better Auth config
│   ├── auth-client.ts               # Client-side Better Auth instance (auto-generated)
│   └── db/
│       ├── index.ts                 # Drizzle + Neon client
│       ├── migrations/              # Drizzle migration files (pnpm db:generate)
│       ├── queries/                 # Reusable Drizzle query helpers
│       ├── schema/auth-schema.ts    # Better Auth tables (auto-generated)
│       └── schema/index.ts
└── proxy.ts                         # Next.js 16 middleware (route protection)
```

### Opinionated feature structure (suggested)

Each feature slice follows this convention — nothing is enforced, adapt freely:

```
features/
└── <feature>/
    ├── components/   React components scoped to this feature
    ├── actions/      Server Actions — plain or via next-safe-action (typed + validated)
    └── hooks/        Client-side hooks (useOptimistic, SWR, react-query, etc.)
```

The `actions/` directories are scaffolded with `.gitkeep` so they exist in the repo and signal intent. Delete or replace them as your data-fetching strategy evolves.

---

## How to Extend

### Add another OAuth provider

1. **`src/lib/auth.ts`** — uncomment or add a provider block (GitHub and Discord examples are already there).
2. **`.env`** — add the provider's `CLIENT_ID` / `CLIENT_SECRET`.
3. **`next.config.ts`** — add the provider's avatar hostname to `images.remotePatterns` if you use `next/image`.
4. **`src/features/auth/components/login-card.tsx`** — add a button that calls `authClient.signIn.social({ provider: "github", ... })`.

### Protect a new route

Add the route path to the `matcher` array in `src/proxy.ts`:

```ts
export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*"],
};
```

The page itself can also do a server-side `auth.api.getSession()` check as a second layer.

### Extend the database schema

Add new tables in `src/lib/db/schema/` and export them from `src/lib/db/schema/index.ts`. Then run:

```bash
pnpm db:push        # fast iteration (dev)
# or
pnpm db:generate && pnpm db:migrate  # migration files (production)
```

### Regenerate the auth schema

If you add Better Auth plugins that require extra tables, regenerate:

```bash
pnpm auth:generate
```

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import in [Vercel](https://vercel.com/new).
3. Add all env variables from `.env.example` in the Vercel dashboard.
4. Update your Google OAuth redirect URI to `https://your-domain.com/api/auth/callback/google`.
5. Deploy.
