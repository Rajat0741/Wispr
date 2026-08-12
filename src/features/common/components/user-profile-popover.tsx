"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { createDm } from "@/features/chat-list/actions/create-dm";
import { useUserProfileQuery } from "@/features/common/queries/useUserProfileQuery";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "./user-avatar";

export interface UserProfilePopoverProps {
  username: string;
  children: React.ReactNode;
  render?: React.ReactElement;
}

export function UserProfilePopover({
  username,
  children,
  render = <div />,
}: UserProfilePopoverProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentUserId = session?.user?.id;

  const { data: profile, isLoading } = useUserProfileQuery(username, open);

  const { execute, isExecuting } = useAction(createDm, {
    onSuccess: ({ data }) => {
      if (!data?.roomId) return;
      setOpen(false);
      router.push(`/chat/${data.roomId}`);
    },
  });

  const isSelf = profile?.id === currentUserId;

  const displayName = profile?.name ?? null;
  const displayImage = profile?.image ?? null;
  const handle = profile?.displayUsername ?? profile?.username ?? null;
  const bio = profile?.bio?.trim() || null;

  const lastActiveAt = profile?.lastActiveAt
    ? new Date(profile.lastActiveAt)
    : null;

  const lastSeenText = lastActiveAt
    ? formatDistanceToNow(lastActiveAt, { addSuffix: true })
    : "Never";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger nativeButton={false} render={render}>
        {children}
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        className="w-80 p-5 rounded-2xl bg-popover text-popover-foreground shadow-2xl border border-border/40 flex flex-col gap-4"
      >
        {isLoading ? (
          <UserProfilePopoverSkeleton />
        ) : (
          <>
            {/* Header */}
            <Item className="p-0 border-0 gap-3.5">
              <ItemMedia className="relative shrink-0">
                <UserAvatar
                  name={displayName}
                  image={displayImage}
                  className="size-12"
                  fallbackClassName="text-xl font-bold"
                />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="text-lg font-bold text-foreground">
                  {displayName ?? "Unknown"}
                </ItemTitle>
                {handle && (
                  <ItemDescription className="text-sm text-muted-foreground">
                    @{handle}
                  </ItemDescription>
                )}
              </ItemContent>
            </Item>

            {/* Bio */}
            {bio ? (
              <p className="text-sm text-foreground/85 leading-relaxed wrap-break-word whitespace-pre-line">
                {bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                No bio provided
              </p>
            )}

            {/* Last seen */}
            <p className="text-xs text-muted-foreground font-medium">
              Last seen{" "}
              <span className="font-semibold text-foreground">
                {lastSeenText}
              </span>
            </p>

            {/* Message Action */}
            {!isSelf && (
              <Button
                className="w-full h-10 rounded-xl gap-2 font-medium bg-primary text-foreground hover:bg-primary/90 transition-colors shadow-sm"
                disabled={isExecuting}
                onClick={() => profile?.id && execute({ userId: profile.id })}
              >
                <MessageCircleIcon className="size-4" />
                {isExecuting ? "Opening…" : "Message"}
              </Button>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function UserProfilePopoverSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header Skeleton using Item */}
      <Item className="p-0 border-0 gap-3.5">
        <ItemMedia>
          <Skeleton className="size-16 rounded-full shrink-0" />
        </ItemMedia>
        <ItemContent className="gap-2 min-w-0">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-16" />
        </ItemContent>
      </Item>

      {/* Bio Skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>

      {/* Last seen Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-2 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Button Skeleton */}
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
