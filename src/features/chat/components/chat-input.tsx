"use client";

import { Plus, SendIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/features/chat/actions/sendMessage";
import { useRoomContext } from "@/features/chat/context/room-context";

export function ChatInput() {
  const { roomId } = useRoomContext();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      className="shrink-0 w-full px-4 pb-4 pt-2"
      onSubmit={handleSubmit}
    >
      <div className="flex items-end gap-2 border px-2 py-2 rounded-2xl bg-accent">
        {/* TODO: implement attachment picker */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          aria-label="Add attachment"
          disabled
        >
          <Plus className="size-5" />
        </Button>

        <Textarea
          placeholder="Type a message..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={10000}
          disabled={isPending}
          className="min-h-0 max-h-32 flex-1 resize-none border-0 bg-transparent px-2 py-2 leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={handleKeyDown}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim() || isPending}
          aria-label="Send message"
          className="size-10 shrink-0 rounded-full hover:bg-muted"
        >
          <SendIcon className="size-5" />
        </Button>
      </div>
    </form>
  );
}
