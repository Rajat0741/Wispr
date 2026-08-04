"use client";

import { betterFetch } from "@better-fetch/fetch";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { supabase } from "@/lib/supabase/client";
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

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchMessagesPage(roomId, pageParam as number | undefined),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);

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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, queryClient, queryKey]);

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
