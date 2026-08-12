import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/features/profile/components/onboarding-form";
import { auth } from "@/lib/auth";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.username) redirect("/chat");

  return (
    <main className="flex h-full items-center justify-center p-4">
      <OnboardingForm />
    </main>
  );
}
