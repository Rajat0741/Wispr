"use client";

import { useQuery } from "@tanstack/react-query";
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
import { betterFetch } from "@better-fetch/fetch";

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

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
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
              <CommandItem
                key={room.roomId}
                value={`${room.name} ${room.lastMessage ?? ""}`}
                onSelect={() => router.push(`/chat/${room.roomId}`)}
                className="flex items-center gap-3 py-2"
              >
                <Avatar>
                  <AvatarImage src={room.image ?? undefined} alt="" />
                  <AvatarFallback>
                    {room.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {room.name}
                    </span>
                    {room.lastMessageCreatedAt && (
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatLastMessageDate(room.lastMessageCreatedAt)}
                      </span>
                    )}
                  </div>
                  <span className="block truncate text-xs text-muted-foreground">
                    {room.lastMessage ?? "No messages yet"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
