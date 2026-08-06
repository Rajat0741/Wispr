"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { AvatarWithLabel } from "@/features/common/components/avatar-with-label";
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
        className="h-auto flex-1 min-w-0 p-1.5 -mx-1.5 text-left cursor-pointer bg-transparent hover:bg-transparent"
        aria-label="View room info"
      >
        <AvatarWithLabel
          name={title}
          image={image}
          title={title}
          subtitle={subtitle}
          titleAs="h1"
          className="flex-1 min-w-0"
          avatarClassName="size-9 shrink-0"
          titleClassName="truncate text-sm text-foreground"
        />
      </Button>
      <ChatHeaderActions onOpenInfo={onClick} className="ml-auto" />
    </header>
  );
}
