"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { CommandItem } from "@/components/ui/command";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { UserAvatar } from "@/features/common/components/user-avatar";

export type ChatListItem = {
  roomId: string;
  name: string;
  image: string | null;
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
};

function formatLastMessageDate(date: string | null) {
  if (!date) return "";

  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

export function ChatItem({
  room,
  onSelect,
}: {
  room: ChatListItem;
  onSelect: () => void;
}) {
  const { name, lastMessage, lastMessageCreatedAt } = room;
  return (
    <CommandItem
      value={`${name} ${lastMessage ?? ""}`}
      onSelect={onSelect}
      className="p-0 cursor-pointer data-selected:bg-muted [&>svg:last-child]:hidden"
    >
      <Item className="w-full pointer-events-none px-3 py-2.5">
        <ItemMedia variant="image" className="size-10">
          <UserAvatar name={room.name} image={room.image} className="size-full" />
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle className="truncate">{room.name}</ItemTitle>
            <span className="text-muted-foreground text-sm shrink-0">
              {formatLastMessageDate(lastMessageCreatedAt)}
            </span>
          </ItemHeader>
          <ItemDescription className="truncate w-full">
            {room.lastMessage ?? "No messages yet"}
          </ItemDescription>
        </ItemContent>
      </Item>
    </CommandItem>
  );
}
