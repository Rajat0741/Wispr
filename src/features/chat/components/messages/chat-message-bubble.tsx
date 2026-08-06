"use client";

import { format } from "date-fns";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { MessageWithSender } from "@/features/chat/types";
import { ReplyPreview } from "./reply-preview";

interface ChatMessageBubbleProps {
  message: MessageWithSender;
  isMine: boolean;
  onReplyTargetClick: (
    replyTarget: NonNullable<MessageWithSender["replyToMessage"]>,
  ) => void;
}

export function ChatMessageBubble({
  message,
  isMine,
  onReplyTargetClick,
}: ChatMessageBubbleProps) {
  const isReply = Boolean(message.replyTo);
  const replyTarget = message.replyToMessage;

  return (
    <Bubble variant={isMine ? "default" : "muted"}>
      <BubbleContent className="max-w-2xl px-2 rounded-md">
        {isReply && (
          <ReplyPreview
            message={replyTarget}
            onClick={replyTarget ? () => onReplyTargetClick(replyTarget) : undefined}
            className="mb-1"
          />
        )}

        <Streamdown className="typeset typeset-docs">
          {message.content}
        </Streamdown>
            <span className="mt-1 block text-right text-[10px] text-muted-foreground">
          {format(new Date(message.createdAt), "h:mm a")}
        </span>
      </BubbleContent>
    </Bubble>
  );
}

