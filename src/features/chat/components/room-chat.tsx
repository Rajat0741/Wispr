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
          if (payload?.id) {
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

  const getRoomMetadata = () => {
    if (roomType === "dm") {
      const partner = members.find((member) => member.id !== activeUserId);
      return {
        title: partner?.name ?? "Direct Message",
        image: partner?.image ?? null,
        subtitle: null,
      };
    }

    return {
      title: group?.name ?? `${members.length} members`,
      image: group?.groupImage ?? null,
      subtitle: members.map((member) => member.name).join(", "),
    };
  };

  const { title: roomTitle, image: roomImage, subtitle: roomSubtitle } = getRoomMetadata();

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
