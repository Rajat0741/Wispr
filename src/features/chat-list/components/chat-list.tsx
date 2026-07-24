"use client";

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
import { ChatItem } from "@/features/chat-list/components/chat-item";
import { useChatRoomsQuery } from "@/features/chat-list/queries/get-chat-rooms";

export function ChatList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { rooms, isPending, isError } = useChatRoomsQuery();
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
        wrapperClassName="p-2 pb-0 text-foreground"
      />
      <CommandList className="max-h-screen">
        {isPending ? (
          <CommandEmpty>Loading conversations...</CommandEmpty>
        ) : isError ? (
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
