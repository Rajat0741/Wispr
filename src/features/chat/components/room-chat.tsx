"use client";

import { useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { RoomInfoPanel } from "./room-info-panel";

export function RoomChat() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <ChatHeader onClick={() => setIsInfoPanelOpen((prev) => !prev)} />

      <div className="flex flex-1 min-h-0 w-full flex-col">
        <ChatMessages />
        <ChatInput />
      </div>

      <RoomInfoPanel
        open={isInfoPanelOpen}
        onOpenChange={setIsInfoPanelOpen}
      />
    </div>
  );
}
