"use client";

import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ChatHeaderActions } from "../actions/chat-header-actions";

export function ChatHeader({ onClick }: { onClick?: () => void }) {
  const title = useChatStore((s) => s.title);
  const image = useChatStore((s) => s.image);
  const subtitle = useChatStore((s) => s.subtitle);

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <Button
        onClick={onClick}
        className="h-auto p-1.5 -mx-1.5 gap-3 justify-start text-left cursor-pointer bg-transparent hover:bg-transparent"
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
      <ChatHeaderActions onOpenInfo={onClick} />
    </header>
  );
}
