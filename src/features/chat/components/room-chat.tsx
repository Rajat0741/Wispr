"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { sendMessage } from "@/features/chat/actions/sendMessage";
import { authClient } from "@/lib/auth-client";
import type { GroupType, MessageType } from "@/lib/db/schema";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@/types/user";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export function RoomChat({
  roomId,
  currentUserId: initialUserId,
  members,
  roomType,
  group,
  initialMessages,
}: {
  roomId: string;
  currentUserId?: string;
  members: User[];
  roomType: "dm" | "group";
  group?: GroupType | null;
  initialMessages: MessageType[];
}) {
  const { data: session } = authClient.useSession();
  const activeUserId = initialUserId || session?.user.id;

  const [messages, setMessages] = useState<MessageType[]>(() => {
    return [...(initialMessages ?? [])].reverse();
  });

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`room:${roomId}`);

    channel
      .on(
        "broadcast",
        { event: "new-message" },
        ({ payload }: { payload: MessageType }) => {
          if (payload && payload.id) {
            setMessages((current) =>
              current.some((m) => m.id === payload.id)
                ? current
                : [...current, payload],
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const { execute } = useAction(sendMessage, {
    onSuccess: ({ data: newMessage }) => {
      if (newMessage) {
        setMessages((current) =>
          current.some((m) => m.id === newMessage.id)
            ? current
            : [...current, newMessage],
        );
      }
    },
    onError: ({ error }) => {
      console.error("Failed to send message:", error);
    },
  });

  const handleSend = async (text: string) => {
    execute({ roomId, message: text, type: "text" });
  };

  const otherMember = members.find((member) => member.id !== activeUserId);

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
        currentUserId={activeUserId}
      />

      <ChatInput onSend={handleSend} />
    </div>
  );
}
