"use client";

import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReplyPreviewMessage = {
  content: string;
  createdAt: Date | string;
  type?: string;
  sender?: {
    name?: string | null;
  } | null;
};

type ReplyPreviewProps = {
  message: ReplyPreviewMessage;
  onDismiss?: () => void;
  onClick?: () => void;
  className?: string;
};

export function ReplyPreview({
  message,
  onDismiss,
  onClick,
  className,
}: ReplyPreviewProps) {
  const senderName = message.sender?.name ?? "Unknown sender";
  const formattedTime = format(new Date(message.createdAt), "h:mm a");

  const ContentWrapper = onClick ? "button" : "div";

  return (
    <div className="flex items-center gap-2 border-l-2 border-primary bg-muted/30 px-2.5 py-1.5 text-left rounded-r-md">
      <ContentWrapper
        {...(onClick ? { type: "button", onClick } : {})}
        className="min-w-0 flex-1 text-left focus-visible:outline-none"
      >
        <p className="truncate text-xs font-semibold text-foreground/90">
          {senderName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {message.content}
          <span className="ml-1 text-[10px] opacity-70">· {formattedTime}</span>
        </p>
      </ContentWrapper>

      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-6 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
          aria-label="Cancel reply"
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
