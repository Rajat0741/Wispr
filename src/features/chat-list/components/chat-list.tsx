"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { ChatHeader } from "@/features/chat-list/components/chat-header";
import { ChatItem, type ChatListItem } from "@/features/chat-list/components/chat-item";

async function getChatRooms(): Promise<ChatListItem[]> {
  const { data, error } = await betterFetch<ChatListItem[]>("/api/chat-rooms");

  if (error) {
    throw new Error("Unable to load conversations.");
  }

  return data;
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
      <ChatHeader />
      <CommandInput
        placeholder="Search chats..."
        value={search}
        onValueChange={setSearch}
        className="text-base"
        wrapperClassName="px-2 py-3 text-foreground"
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
