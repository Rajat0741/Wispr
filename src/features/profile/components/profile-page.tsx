"use client";

import {
  AtSignIcon,
  type LucideIcon,
  MailIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ChangeUsernameDialog } from "@/features/profile/components/change-username-dialog";

interface ProfilePageProps {
  user: {
    name: string;
    image?: string | null;
    username?: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

export function ProfilePage({ user }: ProfilePageProps) {
  const router = useRouter();

  const handleUsernameUpdated = () => {
    toast.add({
      title: "Username updated",
      type: "success",
    });
    router.refresh();
  };

  return (
    <div className="mx-auto space-y-6 p-6 w-3/4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and profile information.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
          <UserAvatar
            name={user.name}
            image={user.image}
            className="size-20 shrink-0 sm:size-24"
          />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <Badge variant={user.emailVerified ? "default" : "secondary"}>
              {user.emailVerified ? "Verified member" : "Convo member"}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <ProfileDetail icon={UserRoundIcon} label="Name">
            {user.name}
          </ProfileDetail>

          <Separator />

          <ProfileDetail icon={MailIcon} label="Email address">
            <div className="flex flex-wrap items-center gap-2">
              <span>{user.email}</span>
              <Badge variant={user.emailVerified ? "default" : "outline"}>
                {user.emailVerified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </ProfileDetail>

          <Separator />

          <ProfileDetail icon={ShieldCheckIcon} label="Member since">
            {user.createdAt}
          </ProfileDetail>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <ProfileDetail icon={AtSignIcon} label="Username">
              {user.username ? `@${user.username}` : "No username set"}
            </ProfileDetail>
            <ChangeUsernameDialog
              currentUsername={user.username}
              onUsernameUpdated={handleUsernameUpdated}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">{label}</p>
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}
