"use client";

import { ChatMessageEventType } from "@ably/chat";
import { useMessages } from "@ably/chat/react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import z from "zod";
import { sendMessage } from "@/features/chat/actions/sendMessage";
import { authClient } from "@/lib/auth-client";
import type { GroupType, MessageType } from "@/lib/db/schema";
import { selectMessageSchema } from "@/lib/db/schema";
import type { User } from "@/types/user";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

const realtimeMessageSchema = selectMessageSchema.extend({
  createdAt: z.coerce.date(),
});

function parseRealtimeMessage(text: string) {
  try {

    const parsed = realtimeMessageSchema.safeParse(JSON.parse(text));

    if (!parsed.success) {
      console.error("Received invalid chat message payload", parsed.error);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Received malformed chat message payload", error);
    return null;
  }
}

export function RoomChat({
  roomId,
  members,
  roomType,
  group,
  initialMessages,
}: {
  roomId: string;
  members: User[];
  roomType: "dm" | "group";
  group?: GroupType | null;
  initialMessages: MessageType[];
}) {
  const { data: session } = authClient.useSession();
  const [messages, setMessages] = useState<MessageType[]>(() => {
    return [...(initialMessages ?? [])].reverse();
  });

  const { execute } = useAction(sendMessage);

  useMessages({
    listener: (event) => {
      if (event.type === ChatMessageEventType.Created) {
        const parsed = parseRealtimeMessage(event.message.text);
        if (!parsed) return;

        setMessages((current) =>
          current.some((message) => message.id === parsed.id)
            ? current
            : [...current, parsed],
        );
      }
    },
  });

  const handleSend = async (text: string) => {
    execute({ roomId, message: text, type: "text" });
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
        members={members}
        roomType={roomType}
        currentUserId={session?.user.id}
      />

      <ChatInput onSend={handleSend} />
    </div>
  );
}
