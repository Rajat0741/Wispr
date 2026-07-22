"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type ChatListItem = {
  roomId: string;
  name: string;
  image: string | null;
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
};

async function getChatRooms(): Promise<ChatListItem[]> {
  const { data, error } = await betterFetch<ChatListItem[]>("/api/chat-rooms");

  if (error) {
    throw new Error("Unable to load conversations.");
  }

  return data;
}

function formatLastMessageDate(date: string | null) {
  if (!date) return "";

  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

function ChatItem({
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
      className="p-0 border-none outline-none cursor-pointer data-selected:bg-muted [&>svg:last-child]:hidden"
    >
      <Item
        size="sm"
        className="w-full border-none bg-transparent hover:bg-transparent shadow-none pointer-events-none"
      >
        <ItemMedia variant="image">
          <Avatar className="size-full">
            <AvatarImage src={room.image ?? undefined} alt={room.name} />
            <AvatarFallback>{room.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle>{room.name}</ItemTitle>
            <span className="text-muted-foreground text-sm">{formatLastMessageDate(lastMessageCreatedAt)}</span>
          </ItemHeader>
          <ItemDescription className="line-clamp-1">
            {room.lastMessage ?? "No messages yet"}
          </ItemDescription>
        </ItemContent>
      </Item>
    </CommandItem>
  );
}

export function ChatList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const roomsQuery = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: getChatRooms,
  });
  const rooms = roomsQuery.data ?? [];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredRooms = normalizedSearch
    ? rooms.filter((room) =>
        `${room.name} ${room.lastMessage ?? ""}`
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : rooms;

  return (
    <Command className="max-w-full h-screen overflow-y-auto border-r rounded-none border-r-border bg-background">
      <CommandInput
        placeholder="Search chats..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-screen">
        {roomsQuery.isPending ? (
          <CommandEmpty>Loading conversations...</CommandEmpty>
        ) : roomsQuery.isError ? (
          <CommandEmpty>Unable to load conversations.</CommandEmpty>
        ) : filteredRooms.length === 0 ? (
          <CommandEmpty>
            {rooms.length === 0 ? "No conversations yet." : "No chats found."}
          </CommandEmpty>
        ) : (
          <CommandGroup>
            {filteredRooms.map((room) => (
              <ChatItem
                key={room.roomId}
                room={room}
                onSelect={() => router.push(`/chat/${room.roomId}`)}
              />
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
