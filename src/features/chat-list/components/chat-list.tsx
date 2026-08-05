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
import { CHAT_EVENTS, REALTIME_TOPICS } from "@/features/chat/constants";
import { ChatHeader } from "@/features/chat-list/components/chat-header";
import { ChatItem } from "@/features/chat-list/components/chat-item";
import {
  CHAT_ROOMS_KEY,
  useChatRoomsQuery,
} from "@/features/chat-list/queries/get-chat-rooms";
import { useRealtimeToken } from "@/hooks/use-realtime-token";
import { authClient } from "@/lib/auth-client";
import { supabase } from "@/lib/supabase/client";

export function ChatList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { rooms, isPending, isError } = useChatRoomsQuery();
  const userId = session?.user?.id;
  const realtimeToken = useRealtimeToken(Boolean(userId));

  useEffect(() => {
    if (!userId) return;
    const chatListTopic = REALTIME_TOPICS.chatList(userId);

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function initChannel() {
      if (!realtimeToken.isSuccess) return;

      channel = supabase.channel(chatListTopic, {
        config: { private: true },
      });

      channel
        .on("broadcast", { event: CHAT_EVENTS.CHAT_LIST_UPDATED }, () => {
          void queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
        })
        .subscribe((status, err) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Access denied to private chat-list channel:", err);
          }
        });
    }

    void initChannel();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [queryClient, realtimeToken.isSuccess, userId]);

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
