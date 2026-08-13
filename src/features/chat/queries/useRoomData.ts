"use client";

import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { getRoomMetadata } from "@/features/chat/utils/getRoomMetadata";
import { authClient } from "@/lib/auth-client";
import { useRoomDataQuery } from "./useRoomDataQuery";

export function useRoomData() {
  const roomId = useChatStore((s) => s.roomId);
  const { data: session } = authClient.useSession();
  const { data, ...query } = useRoomDataQuery(roomId);

  const roomType = data?.roomType ?? "group";
  const currentUserId = session?.user?.id ?? "";
  const members = data?.members ?? [];
  const group = data?.group ?? null;

  const metadata = getRoomMetadata(roomType, members, currentUserId, group);

  return {
    ...query,
    roomId,
    roomType,
    currentUserId,
    members,
    group,
    ...metadata,
  };
}
