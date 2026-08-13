"use client";

import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  type ChatState,
  type ChatStore,
  createChatStore,
} from "@/features/chat/context/chat-store";

const ChatStoreContext = createContext<ChatStore | null>(null);

export interface ChatProviderProps {
  children: React.ReactNode;
  roomId: string;
}

export function ChatProvider({
  children,
  roomId,
}: ChatProviderProps) {
  const storeRef = useRef<ChatStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createChatStore(roomId);
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

