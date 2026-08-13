"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GroupType } from "@/lib/db/schema";
import type { User } from "@/types/user";
import { AppError } from "@/utils/app-error";

export type RoomMember = User & { role: "admin" | "member" | null };

export interface RoomDataQueryResult {
  roomType: "dm" | "group";
  members: RoomMember[];
  group: GroupType | null;
}

export const roomDataQueryKey = (roomId: string) =>
  ["room-data", roomId] as const;

async function fetchRoomData(roomId: string): Promise<RoomDataQueryResult> {
  const { data, error } = await betterFetch<RoomDataQueryResult>(
    `/api/rooms/${roomId}/group`,
  );

  if (error) throw new AppError("Failed to fetch room data.", 500);

  return data;
}

export function useRoomDataQuery(roomId: string) {
  return useQuery({
    queryKey: roomDataQueryKey(roomId),
    queryFn: () => fetchRoomData(roomId),
  });
}

export function useInvalidateRoomData() {
  const queryClient = useQueryClient();
  return (roomId: string) =>
    queryClient.invalidateQueries({ queryKey: roomDataQueryKey(roomId) });
}
