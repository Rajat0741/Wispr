"use client";

import { format } from "date-fns";
import { ReplyIcon } from "lucide-react";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import type { MessageWithSender } from "@/features/chat/types";
import { ReplyPreview } from "./reply-preview";

interface ChatMessageBubbleProps {
  message: MessageWithSender;
  isMine: boolean;
  onReplyTargetClick: (
    replyTarget: NonNullable<MessageWithSender["replyTo"]>,
  ) => void;
}

export function ChatMessageBubble({
  message,
  isMine,
  onReplyTargetClick,
}: ChatMessageBubbleProps) {
  const setReplyTo = useChatStore((s) => s.setReplyTo);
  const replyTarget = message.replyTo;

  return (
    <Bubble variant={isMine ? "default" : "muted"}>
      <BubbleContent className="max-w-2xl gap-2">
        {replyTarget && (
          <ReplyPreview
            message={replyTarget}
            onClick={() => onReplyTargetClick(replyTarget)}
            className="mb-1"
          />
        )}

        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Streamdown className="typeset typeset-docs">
              {message.content}
            </Streamdown>
            <span className="mt-1 block text-right text-[10px] text-muted-foreground/70">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full text-current opacity-70 hover:opacity-100 hover:bg-background/20"
            onClick={() => setReplyTo(message)}
            aria-label="Reply to message"
          >
            <ReplyIcon className="size-4" />
          </Button>
        </div>
      </BubbleContent>
    </Bubble>
  );
}
