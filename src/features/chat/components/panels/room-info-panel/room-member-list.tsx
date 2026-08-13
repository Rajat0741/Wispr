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
import type { GroupType } from "@/lib/db/schema";
import { RoomMemberActions } from "./room-member-actions";

type MemberItemProps = {
  member: RoomMember;
  isMe: boolean;
  isCreator: boolean;
  canManage: boolean;
  roomId: string;
};

function MemberItem({
  member,
  isMe,
  isCreator,
  canManage,
  roomId,
}: MemberItemProps) {
  const username =
    "username" in member ? (member.username as string | null) : null;

  return (
    <CommandItem
      value={member.id}
      className="py-1.5 px-2 mb-1 group/item"
    >
      <ItemMedia variant="image" className="mr-3">
        <UserAvatar
          name={member.name}
          image={member.image}
          className="size-8"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex items-center flex-wrap gap-1">
          <span className="truncate">{member.name}</span>
          {isMe && (
            <Badge variant="default" className="text-[10px] px-1.5 py-0">
              you
            </Badge>
          )}
          {isCreator && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 text-purple-500 bg-purple-500/30"
            >
              creator
            </Badge>
          )}
          {member.role === "admin" && !isCreator && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-500/40 bg-amber-500/10"
            >
              admin
            </Badge>
          )}
        </ItemTitle>
        {username && <ItemDescription>@{username}</ItemDescription>}
      </ItemContent>

      {canManage && <RoomMemberActions member={member} roomId={roomId} />}
    </CommandItem>
  );
}

type RoomMemberListProps = {
  members: RoomMember[];
  currentUserId: string;
  roomId: string;
  group: GroupType | null;
  isAdmin: boolean;
};

export function RoomMemberList({
  members,
  currentUserId,
  roomId,
  group,
  isAdmin,
}: RoomMemberListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 px-1">
        <Users className="size-3 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground uppercase">
          Members · {members.length}
        </p>
      </div>

      <Command className="border border-border/50 bg-transparent" shouldFilter>
        <CommandInput placeholder="Search members…" />
        <CommandList className="max-h-64">
          <CommandEmpty className="py-4 text-xs">
            No members found.
          </CommandEmpty>
          <CommandGroup className="flex flex-col gap-4">
            {members.map((member) => {
              const isMe = member.id === currentUserId;
              const isCreator = group?.createdBy === member.id;
              const canManage = isAdmin && !isMe && !isCreator;

              return (
                <MemberItem
                  key={member.id}
                  member={member}
                  isMe={isMe}
                  isCreator={isCreator}
                  canManage={canManage}
                  roomId={roomId}
                />
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
