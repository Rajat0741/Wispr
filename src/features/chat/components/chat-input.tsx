"use client";

import { SendIcon } from "lucide-react";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { sendMessage } from "@/features/chat/actions/sendMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput({ roomId }: { roomId: string }) {
  const [inputValue, setInputValue] = useState("");

  const { execute, isPending } = useAction(sendMessage, {
    onSuccess: () => {
      setInputValue("");
    },
    onError: ({ error }) => {
      console.error("Failed to send message:", error);
    },
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || isPending) return;
    execute({ roomId, message: text, type: "text" });
  };

  return (
    <form
      className="flex absolute bottom-4 w-full items-center gap-2 px-4"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        maxLength={10000}
        disabled={isPending}
        className="h-12 flex-1 px-4 py-2.5 rounded-full bg-accent focus-visible:ring-0 focus-visible:border-border"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!inputValue.trim() || isPending}
        aria-label="Send message"
        className="size-11 shrink-0 rounded-full"
      >
        <SendIcon className="size-5" />
      </Button>
    </form>
  );
}
