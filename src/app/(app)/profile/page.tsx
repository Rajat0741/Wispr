import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfilePage as ProfilePageView } from "@/features/profile/components/profile-page";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <ProfilePageView
      user={{
        name: session.user.name,
        image: session.user.image,
        username: session.user.username ?? session.user.displayUsername ?? null,
        bio: (session.user as { bio?: string | null }).bio ?? null,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        createdAt: new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(session.user.createdAt),
      }}
    />
  );
}
