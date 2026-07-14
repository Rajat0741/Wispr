import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-black">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Authentication <br />
            <span className="text-zinc-400">made simple.</span>
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A production-ready template with Better Auth, Drizzle ORM, and Next.js.
            Clean code, simple UI, and server-side route protection.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {session ? (
            <Link
              href="/profile"
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go to Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign In
              </Link>
              <Link
                href="https://better-auth.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-6 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:ring-zinc-800 dark:hover:bg-zinc-900"
              >
                Documentation
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
