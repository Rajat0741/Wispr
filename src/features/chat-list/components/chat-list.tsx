"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CHAT_EVENTS } from "@/features/chat/constants";
import { ChatHeader } from "@/features/chat-list/components/chat-header";
import { ChatItem } from "@/features/chat-list/components/chat-item";
import {
  CHAT_ROOMS_KEY,
  useChatRoomsQuery,
} from "@/features/chat-list/queries/get-chat-rooms";
import { authClient } from "@/lib/auth-client";
import { supabase } from "@/lib/supabase/client";

export function ChatList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { rooms, isPending, isError } = useChatRoomsQuery();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`chat-list:${userId}`)
      .on("broadcast", { event: CHAT_EVENTS.CHAT_LIST_UPDATED }, () => {
        void queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return (
    <Command className="max-w-full h-screen overflow-y-auto border-r rounded-none border-r-border bg-background">
      <ChatHeader />
      <CommandInput
        placeholder="Search chats..."
        className="text-base"
        wrapperClassName="p-2 pb-0 text-foreground"
      />
      <CommandList className="max-h-screen">
        {isPending ? (
          <CommandEmpty>Loading conversations...</CommandEmpty>
        ) : isError ? (
          <CommandEmpty>Unable to load conversations.</CommandEmpty>
        ) : (
          <CommandGroup>
            {rooms.map((room) => (
              <ChatItem
                key={room.roomId}
                room={room}
                onSelect={() => router.push(`/chat/${room.roomId}`)}
              />
            ))}
            <CommandEmpty>
              {rooms.length === 0 ? "No conversations yet." : "No chats found."}
            </CommandEmpty>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
