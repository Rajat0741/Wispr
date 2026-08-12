import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChatLayoutShell } from "@/features/chat/components/layout/chat-layout-shell";
import { auth } from "@/lib/auth";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (!session.user.username) redirect("/onboarding");

  return <ChatLayoutShell>{children}</ChatLayoutShell>;
}
