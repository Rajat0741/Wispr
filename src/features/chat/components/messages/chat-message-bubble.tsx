"use client";

import { format } from "date-fns";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { MessageWithSender } from "@/features/chat/types";
import { cn } from "@/lib/utils";
import { ChatMessageMention, renderMentions } from "./chat-message-mention";
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
      <BubbleContent
        className={cn(
          "max-w-full rounded-md px-2",
          isMine
            ? "data-[slot=bubble-content]:bg-(--chat-message-background,var(--primary))!  rounded-br-none"
            : "rounded-bl-none",
        )}
      >
        {isReply && (
          <ReplyPreview
            message={replyTarget}
            onClick={
              replyTarget ? () => onReplyTargetClick(replyTarget) : undefined
            }
            className="mb-1"
          />
        )}

        <Streamdown
          className="typeset typeset-docs select-none md:select-text"
          allowedTags={{ mention: ["username"] }}
          components={{
            mention: ({ username }) => (
              <ChatMessageMention username={String(username ?? "")} />
            ),
          }}
        >
          {renderMentions(message.content)}
        </Streamdown>
        <span className="block text-right text-[10px] text-muted-foreground select-none">
          {format(new Date(message.createdAt), "h:mm a")}
        </span>
      </BubbleContent>
    </Bubble>
  );
}
