"use client";

import {
  ArrowLeftIcon,
  AtSignIcon,
  FileTextIcon,
  type LucideIcon,
  MailIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ChangeBioDialog } from "@/features/profile/components/change-bio-dialog";
import { ChangeUsernameDialog } from "@/features/profile/components/change-username-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfilePageProps {
  user: {
    name: string;
    image?: string | null;
    username?: string | null;
    bio?: string | null;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

export function ProfilePage({ user }: ProfilePageProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleUsernameUpdated = () => {
    toast.add({
      title: "Username updated",
      type: "success",
    });
    router.refresh();
  };

  const handleBioUpdated = () => {
    toast.add({
      title: "Bio updated",
      type: "success",
    });
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col items-start gap-4">
        {isMobile && (
          <Link
            href="/chat"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Back to chats
          </Link>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Profile
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Manage your account and profile information.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center gap-5 border-b bg-muted/30 px-4 py-6 text-center sm:flex-row sm:gap-6 sm:px-6 sm:py-8 sm:text-left">
          <UserAvatar
            name={user.name}
            image={user.image}
            className="size-20 shrink-0 ring-4 ring-background sm:size-24"
          />
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start">
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="max-w-full truncate text-xl font-semibold sm:text-2xl">
                {user.name}
              </h2>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verified member" : "Convo member"}
              </Badge>
            </div>
            <p className="max-w-full break-all text-sm text-muted-foreground sm:break-normal">
              {user.email}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6">
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

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <ProfileDetail icon={FileTextIcon} label="Bio">
              {user.bio && user.bio.trim().length > 0 ? (
                <p className="wrap-break-word line-clamp-4 min-w-0 max-w-xl">{user.bio}</p>
              ) : (
                <span className="text-muted-foreground font-normal">
                  No bio added yet
                </span>
              )}
            </ProfileDetail>
            <ChangeBioDialog
              currentBio={user.bio}
              onBioUpdated={handleBioUpdated}
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
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
        <p className="text-muted-foreground">{label}</p>
        <div className="min-w-0 wrap-break-word font-medium">{children}</div>
      </div>
    </div>
  );
}
