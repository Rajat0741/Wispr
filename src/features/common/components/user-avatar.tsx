"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserProfilePopover } from "./user-profile-popover";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
  enablePopover?: boolean;
  popoverUserId?: string;
}

export function UserAvatar({
  name,
  image,
  className,
  fallbackClassName,
  enablePopover,
  popoverUserId,
}: UserAvatarProps) {
  const fallback = name?.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  const avatar = (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User avatar"} />
      <AvatarFallback
        className={cn("text-xs font-semibold", fallbackClassName)}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );

  if (enablePopover && popoverUserId) {
    return (
      <UserProfilePopover userId={popoverUserId}>
        {avatar}
      </UserProfilePopover>
    );
  }

  return avatar;
}
