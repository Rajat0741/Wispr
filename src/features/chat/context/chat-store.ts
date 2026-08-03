import { createStore, type StoreApi } from "zustand";
import type { MessageWithSender } from "@/features/chat/types";
import { getRoomMetadata } from "@/features/chat/utils/getRoomMetadata";
import type { GroupType } from "@/lib/db/schema";
import type { User } from "@/types/user";

export type RoomMember = User & { role: "admin" | "member" | null };

export interface RoomData {
  roomId: string;
  currentUserId: string;
  roomType: "dm" | "group";
  members: RoomMember[];
  group: GroupType | null;
}

export interface ChatState extends RoomData {
  title: string;
  image: string | null;
  subtitle: string | null;
  replyTo: MessageWithSender | null;

  setReplyTo: (message: MessageWithSender | null) => void;
  clearReplyTo: () => void;
}

export type ChatStore = StoreApi<ChatState>;

/**
 * Creates an isolated Zustand store instance for a single conversation.
 * Using `createStore` (not `create`) ensures no global singleton is shared
 * across conversations — each ChatProvider mounts its own instance.
 */
export const createChatStore = (initialData: RoomData): ChatStore => {
  const { title, image, subtitle } = getRoomMetadata(
    initialData.roomType,
    initialData.members,
    initialData.currentUserId,
    initialData.group,
  );

  return createStore<ChatState>()((set) => ({
    ...initialData,
    title,
    image,
    subtitle,
    replyTo: null,

    setReplyTo: (message) => set({ replyTo: message }),
    clearReplyTo: () => set({ replyTo: null }),
  }));
};
