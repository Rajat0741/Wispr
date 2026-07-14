import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginCard } from "@/features/auth/components/login-card";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/profile");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <LoginCard />
    </main>
  );
}
