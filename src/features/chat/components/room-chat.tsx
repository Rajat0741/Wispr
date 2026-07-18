"use client";

import { ChatMessageEventType, type Message } from "@ably/chat";
import { useMessages } from "@ably/chat/react";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import z from "zod";

type RoomMember = {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
};

export function RoomChat({
  members,
  roomType,
}: {
  members: RoomMember[];
  roomType: "dm" | "group";
}) {
  const { data: session } = authClient.useSession();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const { historyBeforeSubscribe, sendMessage } = useMessages({
    listener: (event) => {
      if (event.type === ChatMessageEventType.Created) {
        setMessages((current) =>
          current.some((message) => message.serial === event.message.serial)
            ? current
            : [...current, event.message],
        );
      }
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (!historyBeforeSubscribe) {
        setIsLoadingHistory(false);
        return;
      }

      try {
        const result = await historyBeforeSubscribe({ limit: 50 });
        if (isMounted) setMessages([...result.items].reverse());
      } catch (error) {
        console.error("Error loading room history", error);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [historyBeforeSubscribe]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({ text });
      setInputValue("");
    } catch (error) {
      console.error("Error sending room message", error);
    } finally {
      setIsSending(false);
    }
  };

  const roomTitle =
    members.length === 2
      ? (members.find((member) => member.id !== session?.user.id)?.name ??
        "Conversation")
      : `${members.length} members`;

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-background h-screen overflow-y-auto">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar>
          <AvatarImage
            src={members[0]?.image ?? undefined}
            alt={`${roomTitle}'s avatar`}
          />
          <AvatarFallback>{roomTitle.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="truncate text-sm font-semibold">{roomTitle}</h1>
        {roomType === "group" && (
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {members.map((member) => member.name).join(", ")}
            </p>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        {isLoadingHistory ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.clientId === session?.user.id;

            return (
              <div
                key={message.serial}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[min(70%,32rem)] rounded-2xl px-3 py-2 text-sm ${
                    isMine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
      >
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isSending}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim() || isSending}
          aria-label="Send message"
        >
          <SendIcon className="size-4" />
        </Button>
      </form>
    </section>
  );
}
