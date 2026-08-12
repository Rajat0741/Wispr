"use client";

import { Plus, SendIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/features/chat/actions/sendMessage";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { ReplyPreview } from "../messages/reply-preview";
import { MentionInput } from "./mention-input";

export function ChatInput() {
  const formRef = useRef<HTMLFormElement>(null);
  const roomId = useChatStore((s) => s.roomId);
  const members = useChatStore((s) => s.members);
  const replyTo = useChatStore((s) => s.replyTo);
  const clearReplyTo = useChatStore((s) => s.clearReplyTo);

  const [inputValue, setInputValue] = useState("");
  const [plainTextValue, setPlainTextValue] = useState("");
  const { execute, isPending } = useAction(sendMessage, {
    onSuccess: () => {
      setInputValue("");
      setPlainTextValue("");
      clearReplyTo();
    },
    onError: ({ error }) => {
      console.error("Failed to send message:", error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = plainTextValue.trim();
    if (!text || isPending) return;
    execute({
      roomId,
      message: text,
      type: "text",
      replyTo: replyTo?.id,
    });
  };

  return (
    <form
      ref={formRef}
      className="shrink-0 w-full px-4 pb-4 pt-2"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2.5 rounded-2xl border bg-accent p-2.5">
        {replyTo && <ReplyPreview message={replyTo} onDismiss={clearReplyTo} />}

        <div className="flex items-end gap-2">
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

          <MentionInput
            members={members}
            value={inputValue}
            onChange={(value, plainText) => {
              setInputValue(value);
              setPlainTextValue(plainText);
            }}
            onSubmit={() => formRef.current?.requestSubmit()}
            disabled={isPending}
          />

          <Button
            type="submit"
            size="icon-lg"
            disabled={!plainTextValue.trim() || isPending}
            aria-label="Send message"
            className="size-10 shrink-0 rounded-full bg-green-600 hover:bg-green-700"
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </form>
  );
}
