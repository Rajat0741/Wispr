"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRoomContext } from "@/features/chat/context/room-context";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@/types/user";

// Main Component

type RoomInfoPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoomInfoPanel({ open, onOpenChange }: RoomInfoPanelProps) {
  const { title, image, subtitle, members, roomType, currentUserId, group } =
    useRoomContext();
  const isMobile = useIsMobile();

  const content = (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3">
        <UserAvatar name={title} image={image} className="size-20 text-2xl" />
        <div className="text-center">
          <p className="font-semibold text-base">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{group?.description || `Group Description not set`}</p>
        </div>
      </div>

      {/* Members — groups only */}
      {roomType === "group" && members.length > 0 && (
        <MembersList members={members} currentUserId={currentUserId} />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">{title} Info</DrawerTitle>
            {subtitle && (
              <DrawerDescription className="sr-only">
                {subtitle}
              </DrawerDescription>
            )}
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">{title} Info</SheetTitle>
          {subtitle && (
            <SheetDescription className="sr-only">{subtitle}</SheetDescription>
          )}
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}

// Sub-components

type MemberItemProps = {
  member: User;
  isMe: boolean;
};

function MemberItem({ member, isMe }: MemberItemProps) {
  const username =
    "username" in member ? (member.username as string | null) : null;

  return (
    <CommandItem
      value={member.name ?? member.id}
      className="py-1.5 px-2 rounded-lg mb-1"
    >
      <ItemMedia variant="image" className="mr-3">
        <UserAvatar
          name={member.name}
          image={member.image}
          className="size-8"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {member.name}
          {isMe && (
            <Badge variant="secondary" className="ml-1.5">
              you
            </Badge>
          )}
        </ItemTitle>
        {username && <ItemDescription>@{username}</ItemDescription>}
      </ItemContent>
    </CommandItem>
  );
}

type MembersListProps = {
  members: User[];
  currentUserId: string;
};

function MembersList({ members, currentUserId }: MembersListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 px-1">
        <Users className="size-3 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground uppercase">
          Members · {members.length}
        </p>
      </div>

      <Command
        className="rounded-xl border border-border/50 bg-transparent"
        shouldFilter
      >
        <CommandInput placeholder="Search members…" />
        <CommandList className="max-h-64">
          <CommandEmpty className="py-4 text-xs">
            No members found.
          </CommandEmpty>
          <CommandGroup className="flex flex-col gap-4">
            {members.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                isMe={member.id === currentUserId}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
