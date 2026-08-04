"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  type ChatState,
  type ChatStore,
  createChatStore,
  type RoomData,
} from "@/features/chat/context/chat-store";

const ChatStoreContext = createContext<ChatStore | null>(null);

export interface ChatProviderProps extends RoomData {
  children: React.ReactNode;
}

export function ChatProvider({
  children,
  roomId,
  currentUserId,
  roomType,
  members,
  group,
}: ChatProviderProps) {
  const storeRef = useRef<ChatStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createChatStore({
      roomId,
      currentUserId,
      roomType,
      members,
      group,
    });
  }

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: ChatState) => T): T {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error("useChatStore must be used within ChatProvider");
  }
  return useStore(store, selector);
}

