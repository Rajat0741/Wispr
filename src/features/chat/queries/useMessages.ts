"use client"

import { useEffect } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import type { MessageWithSender } from "@/features/chat/types";
import { supabase } from "@/lib/supabase/client";

interface MessagesPage {
  messages: MessageWithSender[];
  nextCursor: string | null;
}

async function fetchMessagesPage(
  roomId: string,
  cursor?: string,
): Promise<MessagesPage> {
  const { data, error } = await betterFetch<MessagesPage>(
    `/api/rooms/${roomId}/messages${cursor ? `?cursor=${cursor}` : ""}`,
  );

  if (error) throw new Error(error.message || `Failed to fetch messages`);
  return data!;
}

export function useMessages(roomId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["messages", roomId] as const;

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchMessagesPage(roomId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);

    channel
      .on(
        "broadcast",
        { event: "new-message" },
        ({ payload }: { payload: MessageWithSender }) => {
          if (!payload?.id) return;

          queryClient.setQueryData<typeof query.data>(queryKey, (cachedData) => {
            const firstPage = cachedData?.pages[0];
            if (!firstPage) return cachedData;

            return {
              ...cachedData,
              pages: [
                { ...firstPage, messages: [payload, ...firstPage.messages] },
                ...cachedData.pages.slice(1),
              ],
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, queryClient, queryKey]);

  /**
   * Flatten all pages into a single chronological array.
   * Each page is descending (newest-first), so we reverse each page
   * then reverse the page order to get oldest → newest.
   */
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
