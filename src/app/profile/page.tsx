import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileItem } from "@/features/profile/components/profile-item";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <ProfileItem session={session} />
    </main>
  );
}
