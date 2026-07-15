# Convo

Convo is a real-time chat application built with Next.js. Authentication is handled by Better Auth, with Drizzle ORM and Neon providing the data layer.

## Development

### Requirements

- Node.js 24 or newer
- pnpm 9 or newer
- A Neon PostgreSQL database
- Google OAuth credentials

### Setup

```bash
pnpm install
```

Create `.env` with the database, authentication, and Google OAuth values used by the app:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Sync the database and start the development server:

```bash
pnpm db:push
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use Convo.

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
