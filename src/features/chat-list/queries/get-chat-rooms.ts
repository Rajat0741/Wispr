import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import type { ChatListItem } from "@/features/chat-list/components/chat-item";
import { useIsMobile } from "@/hooks/use-mobile";

export async function getChatRooms(): Promise<ChatListItem[]> {
  const { data, error } = await betterFetch<ChatListItem[]>("/api/chat-rooms", {
    cache: "no-store",
  });

  if (error) {
    throw new Error("Unable to load conversations.");
  }

  return data ?? [];
}

export const CHAT_ROOMS_KEY = ["chat-rooms"] as const;

export function useChatRoomsQuery() {
  const isMobile = useIsMobile();
  const isMobileViewport =
    isMobile ||
    (typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches);

  const query = useQuery({
    queryKey: CHAT_ROOMS_KEY,
    queryFn: getChatRooms,
    refetchOnMount: isMobileViewport ? "always" : undefined,
    refetchOnWindowFocus: isMobileViewport,
    refetchOnReconnect: isMobileViewport,
  });

  return {
    ...query,
    rooms: query.data ?? [],
  };
}
