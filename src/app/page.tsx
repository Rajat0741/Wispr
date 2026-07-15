import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Conversations <br />
            <span>made human.</span>
          </h1>
          <p className="text-lg leading-8">
            A simple place to connect, share ideas, and stay in the flow.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {session ? (
            <Link
              href="/profile"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Open Convo
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Sign In
              </Link>
              <Link
                href="https://better-auth.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
