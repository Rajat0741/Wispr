"use client";

import { UserMenu } from "@/components/user-menu";
import { NewChat } from "@/features/chat-list/components/dialogs/new-chat-dialog";

export function ChatHeader({ title = "Chats" }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <h1 className="text-xl tracking-tight px-1">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <NewChat />
        <UserMenu />
      </div>
    </div>
  );
}
