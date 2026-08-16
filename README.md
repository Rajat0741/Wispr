# Wispr

Wispr is a modern, real-time chat application built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. It features direct messaging, group conversations, instant sync via Supabase Realtime, secure authentication with Better Auth, and a clean, distraction-free interface designed for focused communication.

---

## 🚀 Key Features

*   **Real-Time Messaging**: Instant message delivery and sync using Supabase Realtime with WebSocket-based pub/sub
*   **Dual Conversation Modes**: Support for both direct messages (DMs) and group conversations with role-based permissions
*   **User Profiles**: Customizable usernames and bios with Google OAuth authentication
*   **Room Management**: Create, edit, pin conversations with comprehensive member management
*   **User Search**: Find and add users to conversations with real-time search functionality
*   **Modern UI**: Clean, responsive design with dark mode support and smooth animations

For a full breakdown of platform features, see **FEATURES.md**.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Zustand, TanStack React Query
*   **Real-Time**: Supabase Realtime (WebSocket-based pub/sub messaging)
*   **Database**: PostgreSQL (Supabase), Drizzle ORM
*   **Auth**: Better Auth (with Google OAuth, username plugin, and Dash admin panel)
*   **Asset Management**: ImageKit NodeJS/Next SDK
*   **UI Components**: shadcn/ui, Base UI, Lucide React icons
*   **State Management**: Zustand, TanStack Query
*   **Form Handling**: TanStack Form, Zod validation
*   **Styling**: Tailwind CSS v4

---

## ⚙️ Project Structure

```text
src/
├── app/               # Next.js App Router (Layouts, Pages, APIs)
│   ├── (app)/         # Main application views (chat, onboarding)
│   ├── login/         # Auth pages (Google Sign-In)
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home landing page
│   └── globals.css    # Tailwind CSS v4 imports & custom design tokens
├── components/        # Shared presentation components (logo, theme-toggle, ui)
├── features/          # Domain-driven features
│   ├── auth/          # Authentication components
│   ├── chat/          # Chat UI, state stores, message components
│   ├── chat-list/     # Chat list and room management
│   ├── common/        # Common shared components
│   └── profile/       # User profile and onboarding
├── hooks/             # Custom React hooks
├── lib/               # Shared libraries (auth, db connection, utilities)
│   ├── auth.ts        # Better Auth configuration
│   ├── db/            # Drizzle ORM schema and queries
│   ├── imagekit/      # Image upload utilities
│   ├── supabase/      # Supabase client configuration
│   └── providers/     # React context providers
├── types/             # Global TypeScript type definitions
└── utils/             # Utility functions
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v24+ recommended)
*   `pnpm` package manager
*   A Supabase PostgreSQL database
*   Google OAuth credentials
*   ImageKit account (for image uploads)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (or `.env.local`):
```bash
cp .env.example .env
```

Fill in the required configuration:
- **Database**: `DATABASE_URL` (Supabase PostgreSQL connection string), `DIRECT_DB_URL`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`
- **Auth**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (e.g., `http://localhost:3000`), `BETTER_AUTH_API_KEY`
- **OAuth**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Image Uploads**: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_ENDPOINT`

### 3. Push Database Schema
Ensure your database tables are initialized using Drizzle Kit:
```bash
pnpm db:push
```

### 4. Run the Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience Wispr.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js development server with hot-reload |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Check code with Biome linter |
| `pnpm format` | Format code with Biome |
| `pnpm db:push` | Push database schema changes directly to database |
| `pnpm db:generate` | Generate database migration files |
| `pnpm db:migrate` | Apply pending database migrations |
| `pnpm db:studio` | Open Drizzle Studio for database management |
| `auth:generate` | Generate Better Auth schema |

---

## 🎯 Core Concepts

### Room Types
Wispr supports two types of conversations:
- **Direct Messages (DMs)**: One-to-one conversations between two users
- **Groups**: Multi-user conversations with role-based permissions (admin/member)

### Real-Time Architecture
Messages are delivered instantly using Supabase Realtime's WebSocket-based pub/sub system. When a user sends a message, it's broadcast to all connected clients in the room, ensuring zero-latency communication.

### Authentication Flow
1. User signs in with Google OAuth via Better Auth
2. Session is created and stored in PostgreSQL
3. User completes onboarding to set username and bio
4. Supabase Realtime auth token is set for real-time features

---

## 🚀 Deployment

Wispr can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- Railway
- Self-hosted with Docker

Ensure all environment variables are configured in your deployment environment and run the database migrations before going live.
