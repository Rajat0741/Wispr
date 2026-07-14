import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/features/profile/components/profile-card";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <ProfileCard session={session} />
    </main>
  );
}
