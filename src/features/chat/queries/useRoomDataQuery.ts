"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GroupType } from "@/lib/db/schema";

export const roomDataQueryKey = (roomId: string) =>
  ["room-data", roomId] as const;

async function fetchRoomGroup(roomId: string): Promise<GroupType | null> {
  const { data, error } = await betterFetch<GroupType | null>(
    `/api/rooms/${roomId}/group`,
  );

  if (error) throw new Error("Failed to fetch room group data.");

  return data ?? null;
}

export function useRoomDataQuery(roomId: string) {
  return useQuery({
    queryKey: roomDataQueryKey(roomId),
    queryFn: () => fetchRoomGroup(roomId),
  });
}

export function useInvalidateRoomData() {
  const queryClient = useQueryClient();
  return (roomId: string) =>
    queryClient.invalidateQueries({ queryKey: roomDataQueryKey(roomId) });
}
