import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginCard } from "@/features/auth/components/login-card";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(session.user.username ? "/chat" : "/onboarding");

  return (
    <main className="relative flex min-h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl" />
      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <a href="/" className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-lg font-semibold tracking-tight">wispr</span>
        </a>
        <ThemeToggle />
      </header>
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <LoginCard />
      </div>
    </main>
  );
}
