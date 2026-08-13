"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { useRoomDataQuery } from "@/features/chat/queries/useRoomDataQuery";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppError } from "@/utils/app-error";
import { ChatMessages } from "../messages/chat-messages";
import { RoomInfoPanel } from "../panels/room-info-panel/room-info-panel";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";

export function RoomChat() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const roomId = useChatStore((s) => s.roomId);
  const { error, isError } = useRoomDataQuery(roomId);

  useEffect(() => {
    if (isError) {
      const isForbiddenOrNotFound =
        error instanceof AppError &&
        (error.statusCode === 403 || error.statusCode === 404);

      if (isForbiddenOrNotFound) {
        toast.add({
          title: "Access Removed",
          description: "You no longer have access to this conversation.",
        });
        router.replace("/chat");
      }
    }
  }, [isError, error, router]);

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
