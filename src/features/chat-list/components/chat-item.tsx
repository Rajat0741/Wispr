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
import { ChatItemActions } from "@/features/chat-list/components/chat-item-actions";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type ChatListItem = {
  roomId: string;
  roomType: "dm" | "group";
  name: string;
  image: string | null;
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
  isPinned: boolean;
};

function formatLastMessageDate(date: string | null) {
  if (!date) return "No messages yet";

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

  const [actionsOpen, setActionsOpen] = useState(false);
  const isHighlighted = isActive || actionsOpen;

  return (
    <CommandItem
      value={`${name} ${lastMessage ?? ""}`}
      onSelect={onSelect}
      data-active={isActive}
      className={cn(
        "group p-0 mt-2 cursor-pointer [&>svg:last-child]:hidden hover:bg-accent",
        isHighlighted
          ? "bg-accent data-selected:bg-accent"
          : "data-selected:bg-transparent",
      )}
    >
      <Item className="w-full px-3 py-2">
        <ItemMedia variant="image" className="size-10">
          <UserAvatar
            name={room.name}
            image={room.image}
            className="size-full"
          />
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle className="truncate">{room.name}</ItemTitle>
            <span className="text-muted-foreground text-sm shrink-0">
              {formatLastMessageDate(lastMessageCreatedAt)}
            </span>
          </ItemHeader>
          <ItemDescription>
            <div className="flex justify-between">
              <p className="text-xs truncate w-full">
                {room.lastMessage ?? "No messages yet"}
              </p>
              <ChatItemActions
                roomId={room.roomId}
                roomName={room.name}
                isGroup={room.roomType === "group"}
                isPinned={room.isPinned}
                isActive={isActive}
                className={cn(
                  "md:group-hover/item:opacity-100",
                  isHighlighted && "opacity-100 md:opacity-100",
                )}
                onOpenChange={setActionsOpen}
              />
            </div>
          </ItemDescription>
        </ItemContent>
      </Item>
    </CommandItem>
  );
}
