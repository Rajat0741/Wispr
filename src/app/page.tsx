import {
  ArrowRight,
  CheckCheck,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="dark relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-112.5 w-175 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-87.5 w-87.5 rounded-full bg-emerald-700/10 blur-[100px]" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Logo size="sm" />
            <span className="text-base font-semibold tracking-tight text-foreground">
              wispr
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v1.0
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            {session ? (
              <Link
                href={session.user.username ? "/chat" : "/onboarding"}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "group h-9 rounded-full px-4 text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground",
                )}
              >
                Open Wispr
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "group h-9 rounded-full px-4 text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground",
                  )}
                >
                  Get Started
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Hero Container */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Hero Content */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            {/* Status Pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:mb-6">
              <Sparkles className="size-3.5 text-emerald-400" />
              <span>Direct, real-time messaging</span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Real conversations.
              <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Zero distractions.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:mt-5 sm:text-base sm:leading-relaxed">
              Wispr is a clean, focused messenger built for direct conversations
              with the people who matter — without the social feed clutter.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
              {session ? (
                <Link
                  href={session.user.username ? "/chat" : "/onboarding"}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group h-11 rounded-xl px-6 text-sm font-medium shadow-md shadow-emerald-500/10 gap-2",
                  )}
                >
                  Go to Messages
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group h-11 rounded-xl px-6 text-sm font-medium shadow-md shadow-emerald-500/10 gap-2",
                    )}
                  >
                    Start a conversation
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 rounded-xl px-6 text-sm font-medium border-border/80 hover:bg-muted/50",
                    )}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Minimal highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-emerald-400" />
                End-to-end encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-emerald-400" />
                Instant real-time sync
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                No tracking or ads
              </span>
            </div>
          </div>

          {/* Right Column: App Preview Showcase */}
          <div className="w-full lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl border border-border/80 bg-card/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5">
              {/* Window Header */}
              <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-9 items-center justify-center rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
                    SC
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Sarah Chen
                    </p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="size-1 rounded-full bg-emerald-400" />
                      Active now
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 py-1">
                {/* Incoming message */}
                <div className="flex flex-col items-start gap-1">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-muted/80 px-3.5 py-2 text-xs leading-relaxed text-foreground">
                    Hey! Have you tried the new update? It feels remarkably
                    fast.
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 px-1">
                    10:42 AM
                  </span>
                </div>

                {/* Outgoing message */}
                <div className="flex flex-col items-end gap-1">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary px-3.5 py-2 text-xs leading-relaxed text-primary-foreground font-medium">
                    Yes! Love the focus on clean, quiet conversations. Exactly
                    what we needed.
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 px-1">
                    <span>10:43 AM</span>
                    <CheckCheck className="size-3 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Mock Input Bar */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2">
                <span className="text-xs text-muted-foreground/50 flex-1">
                  Write a reply...
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors"
                >
                  <Send className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-background/40">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Wispr. A quiet space for conversations.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
