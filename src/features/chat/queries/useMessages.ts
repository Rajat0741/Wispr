"use client";

import { betterFetch } from "@better-fetch/fetch";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { CHAT_EVENTS, REALTIME_TOPICS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { useRealtimeToken } from "@/hooks/use-realtime-token";
import { supabase } from "@/lib/supabase/client";
import { useInvalidateRoomData } from "./useRoomDataQuery";
import {
  type MessagesPage,
  updateMessagesCache,
} from "../utils/updateMessagesCache";

async function fetchMessagesPage(
  roomId: string,
  cursor?: number,
): Promise<MessagesPage> {
  const params = new URLSearchParams();
  if (cursor !== undefined) {
    params.set("cursor", cursor.toString());
  }
  const queryString = params.toString();
  const url = `/api/rooms/${roomId}/messages${queryString ? `?${queryString}` : ""}`;

  const { data, error } = await betterFetch<MessagesPage>(url);

  if (error) throw new Error(error.message || `Failed to fetch messages`);
  return data;
}

export function useMessages(roomId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["messages", roomId] as const;
  const realtimeToken = useRealtimeToken();

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchMessagesPage(roomId, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const invalidateRoomData = useInvalidateRoomData();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function initChannel() {
      if (!realtimeToken.isSuccess) return;

      channel = supabase.channel(REALTIME_TOPICS.room(roomId), {
        config: { private: true },
      });

      channel
        .on(
          "broadcast",
          { event: CHAT_EVENTS.MESSAGE_UPDATES },
          ({ payload }: { payload: MessageWithSender }) => {
            if (!payload?.id) return;

            queryClient.setQueryData<InfiniteData<MessagesPage>>(
              queryKey,
              (cachedData) => updateMessagesCache(cachedData, payload),
            );
          },
        )
        .on("broadcast", { event: CHAT_EVENTS.ROOM_DATA_UPDATED }, () => {
          void invalidateRoomData(roomId);
        })
        .subscribe((status, err) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Access denied to private room channel:", err);
          }
        });
    }

    void initChannel();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [roomId, queryClient, queryKey, realtimeToken.isSuccess, invalidateRoomData]);

  const messages = (query.data?.pages ?? [])
    .slice()
    .reverse()
    .flatMap((page) => page.messages.slice().reverse());

  return {
    messages,
    isPending: query.isPending,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
  };
}
