import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import type { ChatListItem } from "@/features/chat-list/components/chat-item";

export async function getChatRooms(): Promise<ChatListItem[]> {
  const { data, error } = await betterFetch<ChatListItem[]>("/api/chat-rooms");

  if (error) {
    throw new Error("Unable to load conversations.");
  }

  return data ?? [];
}

export const CHAT_ROOMS_KEY = ["chat-rooms"] as const;

export function useChatRoomsQuery() {
  const query = useQuery({
    queryKey: CHAT_ROOMS_KEY,
    queryFn: getChatRooms,
  });

  return {
    ...query,
    rooms: query.data ?? [],
  };
}
