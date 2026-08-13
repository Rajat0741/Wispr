import { createStore, type StoreApi } from "zustand";
import type { MessageWithSender } from "@/features/chat/types";

export interface ChatState {
  roomId: string;
  replyTo: MessageWithSender | null;

  setReplyTo: (message: MessageWithSender | null) => void;
  clearReplyTo: () => void;
}

export type ChatStore = StoreApi<ChatState>;

/** Creates an isolated store for local state in a single conversation. */
export const createChatStore = (roomId: string): ChatStore => {
  return createStore<ChatState>()((set) => ({
    roomId,
    replyTo: null,

    setReplyTo: (message) => set({ replyTo: message }),
    clearReplyTo: () => set({ replyTo: null }),
  }));
};
