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
  popoverUsername?: string;
}

export function UserAvatar({
  name,
  image,
  className,
  fallbackClassName,
  enablePopover,
  popoverUsername,
}: UserAvatarProps) {
  const fallback = name?.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  const avatar = (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User avatar"} className="size-full object-cover" />
      <AvatarFallback
        className={cn("text-xs font-semibold", fallbackClassName)}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );

  if (enablePopover && popoverUsername) {
    return (
      <UserProfilePopover username={popoverUsername}>
        {avatar}
      </UserProfilePopover>
    );
  }

  return avatar;
}
