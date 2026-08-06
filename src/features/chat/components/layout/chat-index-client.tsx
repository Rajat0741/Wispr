"use client";

import { ChatList } from "@/features/chat-list/components/chat-list";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChatIndexClient() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ChatList />;
  }

  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-background px-6 text-center">
      <p className="text-sm text-muted-foreground">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}
