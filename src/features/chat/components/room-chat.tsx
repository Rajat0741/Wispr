"use client";

import { ChatMessageEventType } from "@ably/chat";
import { useMessages } from "@ably/chat/react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Group } from "@/lib/db/schema";
import type { User } from "@/types/user";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export interface ChatMessage {
  serial: string;
  text: string;
  timestamp: Date;
  clientId: string;
}

export function RoomChat({
  members,
  roomType,
  group,
  initialMessages,
}: {
  members: User[];
  roomType: "dm" | "group";
  group?: Group | null;
  initialMessages: {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    createdAt: Date | string;
  }[];
}) {
  const { data: session } = authClient.useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const mapped = (initialMessages ?? []).map((msg) => ({
      serial: msg.id,
      text: msg.content,
      timestamp: new Date(msg.createdAt),
      clientId: msg.senderId,
    }));
    return [...mapped].reverse();
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const { sendMessage } = useMessages({
    listener: (event) => {
      if (event.type === ChatMessageEventType.Created) {
        setMessages((current) =>
          current.some((message) => message.serial === event.message.serial)
            ? current
            : [
                ...current,
                {
                  serial: event.message.serial,
                  text: event.message.text,
                  timestamp: event.message.timestamp,
                  clientId: event.message.clientId,
                },
              ],
        );
      }
    },
  });


  const handleSend = async (text: string) => {
    await sendMessage({ text });
  };

  const otherMember = members.find((member) => member.id !== session?.user.id);

  const roomTitle =
    roomType === "dm"
      ? (otherMember?.name ?? "Conversation")
      : (group?.name ?? `${members.length} members`);

  const roomImage =
    roomType === "dm"
      ? (otherMember?.image ?? null)
      : (group?.groupImage ?? null);

  const roomSubtitle =
    roomType === "group"
      ? members.map((member) => member.name).join(", ")
      : null;

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <ChatHeader title={roomTitle} image={roomImage} subtitle={roomSubtitle} />

      <ChatMessages
        messages={messages}
        isLoadingHistory={isLoadingHistory}
        members={members}
        roomType={roomType}
        currentUserId={session?.user.id}
      />

      <ChatInput onSend={handleSend} />
    </div>
  );
}

