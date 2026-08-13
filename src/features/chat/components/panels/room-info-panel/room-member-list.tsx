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
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { RoomMember } from "@/features/chat/queries/useRoomDataQuery";
import { UserAvatar } from "@/features/common/components/user-avatar";

type MemberItemProps = {
  member: RoomMember;
  isMe: boolean;
};

function MemberItem({ member, isMe }: MemberItemProps) {
  const username =
    "username" in member ? (member.username as string | null) : null;

  return (
    <CommandItem
      value={member.name ?? member.id}
      className="py-1.5 px-2 mb-1"
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
            <Badge variant="default" className="ml-1.5">
              you
            </Badge>
          )}
          {member.role === "admin" && (
            <Badge
              variant="outline"
              className="ml-1.5 text-amber-500 border-amber-500/40 bg-amber-500/10"
            >
              admin
            </Badge>
          )}
        </ItemTitle>
        {username && <ItemDescription>@{username}</ItemDescription>}
      </ItemContent>
    </CommandItem>
  );
}

type RoomMemberListProps = {
  members: RoomMember[];
  currentUserId: string;
};

export function RoomMemberList({
  members,
  currentUserId,
}: RoomMemberListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 px-1">
        <Users className="size-3 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground uppercase">
          Members · {members.length}
        </p>
      </div>

      <Command
        className="border border-border/50 bg-transparent"
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
