"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { supabase } from "@/lib/supabase/client";

interface MessagesPage {
  messages: MessageWithSender[];
  nextCursor: number | null;
}

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

          queryClient.setQueryData<typeof query.data>(
            queryKey,
            (cachedData) => {
              if (!cachedData?.pages?.length) return cachedData;

              let exists = false;

              const newPages = cachedData.pages.map((page) => {
                const hasMessage = page.messages.some(
                  (m) => m.id === payload.id,
                );
                if (hasMessage) {
                  exists = true;
                  return {
                    ...page,
                    messages: page.messages.map((m) =>
                      m.id === payload.id ? payload : m,
                    ),
                  };
                }
                return page;
              });

              if (exists) {
                return { ...cachedData, pages: newPages };
              }

              const firstPage = cachedData.pages[0];
              return {
                ...cachedData,
                pages: [
                  {
                    ...firstPage,
                    messages: [payload, ...firstPage.messages],
                  },
                  ...cachedData.pages.slice(1),
                ],
              };
            },
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
