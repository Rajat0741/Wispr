import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { auth } from "@/lib/auth";
import { UserCircleIcon } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserCircleIcon />
        </EmptyMedia>
        <EmptyTitle>Profile</EmptyTitle>
        <EmptyDescription>
          Profile settings will appear here when the feature is ready.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
