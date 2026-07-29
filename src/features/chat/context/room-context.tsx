"use client";

import { createContext, useContext } from "react";
import { getRoomMetadata } from "@/features/chat/utils/getRoomMetadata";
import type { GroupType } from "@/lib/db/schema";
import type { User } from "@/types/user";

type RoomData = {
  roomId: string;
  currentUserId: string;
  roomType: "dm" | "group";
  members: User[];
  group: GroupType | null;
};

type RoomContextValue = RoomData & {
  title: string;
  image: string | null;
  subtitle: string | null;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function useRoomContext(): RoomContextValue {
  const ctx = useContext(RoomContext);
  if (!ctx)
    throw new Error("useRoomContext must be used within RoomChatProvider");
  return ctx;
}

export function RoomChatProvider({
  children,
  roomId,
  currentUserId,
  roomType,
  members,
  group,
}: React.PropsWithChildren<RoomData>) {
  const { title, image, subtitle } = getRoomMetadata(
    roomType,
    members,
    currentUserId,
    group,
  );

  return (
    <RoomContext.Provider
      value={{
        roomId,
        currentUserId,
        roomType,
        members,
        group,
        title,
        image,
        subtitle,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
