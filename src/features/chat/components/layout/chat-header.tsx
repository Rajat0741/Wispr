"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ChatHeaderActions } from "../actions/chat-header-actions";

export function ChatHeader({
  onClick,
  onBack,
}: {
  onClick?: () => void;
  onBack?: () => void;
}) {
  const title = useChatStore((s) => s.title);
  const image = useChatStore((s) => s.image);
  const subtitle = useChatStore((s) => s.subtitle);

  return (
    <header className="flex items-center border-b px-4 py-2">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="-ml-1.5 mr-1 shrink-0"
          aria-label="Back to chats"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      <Button
        onClick={onClick}
        className="h-auto flex-1 min-w-0 p-1.5 -mx-1.5 gap-3 justify-start text-left cursor-pointer bg-transparent hover:bg-transparent"
        aria-label="View room info"
      >
        <UserAvatar name={title} image={image} className="size-9" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </Button>
      <ChatHeaderActions onOpenInfo={onClick} className="ml-auto" />
    </header>
  );
}
