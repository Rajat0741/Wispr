"use client";

import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { NewChat } from "@/features/chat-list/components/dialogs/new-chat-dialog";

export function ChatHeader({ title = "wispr" }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <Logo size="md" />
        <h1 className="text-xl tracking-tight px-1">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <NewChat />
        <UserMenu />
      </div>
    </div>
  );
}
