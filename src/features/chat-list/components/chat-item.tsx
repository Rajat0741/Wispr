"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useParams } from "next/navigation";
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
import { cn } from "@/lib/utils";

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
  const params = useParams();
  const isActive = params?.roomId === room.roomId;
  const { name, lastMessage, lastMessageCreatedAt } = room;

  return (
    <CommandItem
      value={`${name} ${lastMessage ?? ""}`}
      onSelect={onSelect}
      data-active={isActive}
      className={cn(
        "p-0 mt-2 cursor-pointer [&>svg:last-child]:hidden hover:bg-muted",
        isActive
          ? "bg-muted data-selected:bg-muted"
          : "data-selected:bg-transparent"
      )}
    >
      <Item className="w-full pointer-events-none px-3 py-2">
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
