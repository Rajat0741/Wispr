"use client";

import { format } from "date-fns";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { MessageWithSender } from "@/features/chat/types";

interface ChatMessageBubbleProps {
  message: MessageWithSender;
  isMine: boolean;
}

export function ChatMessageBubble({
  message,
  isMine,
}: ChatMessageBubbleProps) {
  return (
    <Bubble variant={isMine ? "default" : "muted"}>
      <BubbleContent className="max-w-2xl">
        <Streamdown className="typeset typeset-docs">{message.content}</Streamdown>
        <span className="mt-1 block text-right text-[10px] text-muted-foreground/70">
          {format(new Date(message.createdAt), "h:mm a")}
        </span>
      </BubbleContent>
    </Bubble>
  );
}
