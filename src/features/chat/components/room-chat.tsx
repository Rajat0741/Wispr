"use client";

import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export function RoomChat({
  roomId,
  currentUserId,
  roomType,
}: {
  roomId: string;
  currentUserId: string;
  roomType: "dm" | "group";
}) {
  return (
    <div className="flex flex-1 min-h-0 w-full flex-col">
      <ChatMessages
        roomId={roomId}
        roomType={roomType}
        currentUserId={currentUserId}
      />

      <ChatInput roomId={roomId} />
    </div>
  );
}
