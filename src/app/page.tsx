import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="dark relative isolate flex min-h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-96 rounded-full bg-emerald-300/10 blur-3xl" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-lg font-semibold tracking-tight">wispr</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-16 pt-8 sm:px-8 sm:pb-24">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/30 px-3 py-1.5 text-sm font-medium text-foreground">
              <Sparkles className="size-4" />
              Conversations, without the noise
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Say what you mean.
              <span className="mt-2 block text-primary">Stay connected.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Wispr is a calm, focused space for real conversations, shared
              ideas, and the people you want to hear from.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {session ? (
                <Link
                  href={session.user.username ? "/chat" : "/onboarding"}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-xl px-6",
                  )}
                >
                  Open Wispr
                  <ArrowUpRight className="size-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 rounded-xl px-6",
                    )}
                  >
                    Start a conversation
                    <ArrowUpRight className="size-4" />
                  </Link>
                  <Link
                    href="https://better-auth.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 rounded-xl px-6",
                    )}
                  >
                    Learn more
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative hidden min-h-100 lg:block">
            <div className="absolute inset-x-8 top-8 h-72 rotate-[-7deg] rounded-[2rem] border border-primary/20 bg-card/60 shadow-2xl shadow-primary/10 backdrop-blur-sm" />
            <div className="absolute inset-x-0 top-0 rounded-[2rem] border border-border/70 bg-card p-5 shadow-2xl shadow-black/10">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Logo size="sm" />
                  <div>
                    <p className="text-sm font-semibold">wispr</p>
                    <p className="text-xs text-muted-foreground">
                      your conversations
                    </p>
                  </div>
                </div>
                <MessageCircle className="size-5 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted p-4 text-sm leading-6">
                  The best ideas usually start with a simple question.
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary p-4 text-sm leading-6 text-primary-foreground">
                  What are you curious about today?
                </div>
                <div className="flex items-center gap-1.5 px-1 pt-2 text-xs text-muted-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />{" "}
                  Someone is typing...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
