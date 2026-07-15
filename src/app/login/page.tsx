import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginCard } from "@/features/auth/components/login-card";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/profile");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginCard />
    </main>
  );
}
