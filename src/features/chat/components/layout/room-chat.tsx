"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessages } from "../messages/chat-messages";
import { RoomInfoPanel } from "../panels/room-info-panel/room-info-panel";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";

export function RoomChat() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <div className="flex h-dvh w-full max-w-screen flex-col overflow-hidden bg-background">
      <ChatHeader
        onClick={() => setIsInfoPanelOpen((prev) => !prev)}
        onBack={isMobile ? () => router.push("/chat") : undefined}
      />

      <div className="flex flex-1 min-h-0 w-full flex-col">
        <ChatMessages />
        <ChatInput />
      </div>

      <RoomInfoPanel open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen} />
    </div>
  );
}
