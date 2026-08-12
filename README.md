# Wispr

Wispr is a real-time chat application built with Next.js. Authentication is handled by Better Auth, with Drizzle ORM and Supabase Postgres providing the data layer, and Supabase Realtime supplying instant broadcast messaging.

## Development

### Requirements

- Node.js 24 or newer
- pnpm 9 or newer
- A Supabase PostgreSQL database
- Google OAuth credentials

### Setup

```bash
pnpm install
```

Create `.env` based on `.env.example`:

```env
# Database Connections (Supabase Postgres via Drizzle)
DATABASE_URL=
DIRECT_DB_URL=

# Supabase Realtime & API Keys
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_JWT_SECRET=

# Better Auth Configuration
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Sync the application database and start the development server:

```bash
pnpm db:push
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use Wispr.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Check the code with Biome |
| `pnpm format` | Format the code with Biome |
| `pnpm db:push` | Sync the database schema |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate` | Apply database migrations |
| `pnpm db:studio` | Open Drizzle Studio |
