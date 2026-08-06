"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReplyPreviewMessage = {
  content: string;
  createdAt: Date | string;
  type?: string;
  isDeleted?: boolean;
  sender?: {
    name?: string | null;
  } | null;
};

type ReplyPreviewProps = {
  message: ReplyPreviewMessage | null | undefined;
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
  const isDeleted = !message;
  const senderName = isDeleted
    ? "User"
    : (message.sender?.name ?? "Unknown sender");

  const ContentWrapper = onClick ? "button" : "div";

  return (
    <div
      className={cn(
        "flex items-center rounded-md gap-2 border-border border-2 border-l-5 border-l-purple-400 bg-muted/30 px-2.5 py-1.5 text-left shadow-xs",
        className,
      )}
    >
      <ContentWrapper
        {...(onClick ? { type: "button", onClick } : {})}
        className="min-w-0 flex-1 text-left focus-visible:outline-none"
      >
        <p className="truncate text-xs font-semibold text-foreground/90">
          {senderName}
        </p>
        <p
          className={cn(
            "truncate text-sm",
            isDeleted ? "italic text-muted-foreground/70" : "text-muted-foreground",
          )}
        >
          {isDeleted ? "Deleted Message" : message.content}
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
